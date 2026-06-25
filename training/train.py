import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import numpy as np
from models.architecture import ExoplanetDetectorNet

class Trainer:
    def __init__(self, model=None, lr=1e-3, weight_decay=1e-4, device=None, checkpoint_dir='saved_models'):
        self.device = device or torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = model or ExoplanetDetectorNet()
        self.model.to(self.device)
        
        self.criterion = nn.BCELoss()
        self.optimizer = optim.Adam(self.model.parameters(), lr=lr, weight_decay=weight_decay)
        self.scheduler = optim.lr_scheduler.ReduceLROnPlateau(self.optimizer, mode='min', factor=0.5, patience=3, verbose=True)
        self.checkpoint_dir = checkpoint_dir
        os.makedirs(checkpoint_dir, exist_ok=True)
        
    def train_epoch(self, dataloader, scaler=None):
        self.model.train()
        total_loss = 0
        correct = 0
        total = 0
        
        for batch_x, batch_y in dataloader:
            batch_x, batch_y = batch_x.to(self.device), batch_y.to(self.device).unsqueeze(1)
            
            self.optimizer.zero_grad()
            
            # Support Mixed Precision
            if scaler is not None:
                with torch.cuda.amp.autocast():
                    out, _ = self.model(batch_x)
                    loss = self.criterion(out, batch_y)
                scaler.scale(loss).backward()
                # Gradient Clipping
                scaler.unscale_(self.optimizer)
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
                scaler.step(self.optimizer)
                scaler.update()
            else:
                out, _ = self.model(batch_x)
                loss = self.criterion(out, batch_y)
                loss.backward()
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
                self.optimizer.step()
                
            total_loss += loss.item() * batch_x.size(0)
            preds = (out > 0.5).float()
            correct += preds.eq(batch_y).sum().item()
            total += batch_x.size(0)
            
        return total_loss / total, correct / total

    def evaluate(self, dataloader):
        self.model.eval()
        total_loss = 0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for batch_x, batch_y in dataloader:
                batch_x, batch_y = batch_x.to(self.device), batch_y.to(self.device).unsqueeze(1)
                out, _ = self.model(batch_x)
                loss = self.criterion(out, batch_y)
                
                total_loss += loss.item() * batch_x.size(0)
                preds = (out > 0.5).float()
                correct += preds.eq(batch_y).sum().item()
                total += batch_x.size(0)
                
        return total_loss / total, correct / total

    def train(self, train_data, val_data, epochs=20, batch_size=32, early_stopping_patience=5, use_amp=False, callback=None):
        train_x, train_y = train_data
        val_x, val_y = val_data
        
        train_dataset = TensorDataset(torch.tensor(train_x), torch.tensor(train_y))
        val_dataset = TensorDataset(torch.tensor(val_x), torch.tensor(val_y))
        
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
        
        best_val_loss = float('inf')
        patience_counter = 0
        history = {
            'train_loss': [], 'train_acc': [],
            'val_loss': [], 'val_acc': []
        }
        
        scaler = torch.cuda.amp.GradScaler() if (use_amp and self.device.type == 'cuda') else None
        
        for epoch in range(1, epochs + 1):
            train_loss, train_acc = self.train_epoch(train_loader, scaler)
            val_loss, val_acc = self.evaluate(val_loader)
            
            self.scheduler.step(val_loss)
            
            history['train_loss'].append(train_loss)
            history['train_acc'].append(train_acc)
            history['val_loss'].append(val_loss)
            history['val_acc'].append(val_acc)
            
            # Custom callback to stream logs to web socket or console
            if callback:
                callback(epoch, train_loss, train_acc, val_loss, val_acc)
            
            print(f"Epoch {epoch}/{epochs} | Train Loss: {train_loss:.4f} Acc: {train_acc:.4f} | Val Loss: {val_loss:.4f} Acc: {val_acc:.4f}")
            
            # Save Checkpoint
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                patience_counter = 0
                checkpoint_path = os.path.join(self.checkpoint_dir, 'best_model.pt')
                torch.save({
                    'epoch': epoch,
                    'model_state_dict': self.model.state_dict(),
                    'optimizer_state_dict': self.optimizer.state_dict(),
                    'val_loss': val_loss,
                    'val_acc': val_acc
                }, checkpoint_path)
            else:
                patience_counter += 1
                
            if patience_counter >= early_stopping_patience:
                print("Early stopping triggered.")
                break
                
        return history

    def load_checkpoint(self, path):
        if os.path.exists(path):
            checkpoint = torch.load(path, map_location=self.device)
            self.model.load_state_dict(checkpoint['model_state_dict'])
            self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
            print(f"Loaded checkpoint from {path} (Epoch {checkpoint['epoch']})")
            return checkpoint
        else:
            raise FileNotFoundError(f"No checkpoint found at {path}")
