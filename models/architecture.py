import torch
import torch.nn as nn
import torch.nn.functional as F

class ResidualBlock1D(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1, dropout=0.2):
        super(ResidualBlock1D, self).__init__()
        self.conv1 = nn.Conv1d(in_channels, out_channels, kernel_size=5, stride=stride, padding=2, bias=False)
        self.bn1 = nn.BatchNorm1d(out_channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv1d(out_channels, out_channels, kernel_size=5, stride=1, padding=2, bias=False)
        self.bn2 = nn.BatchNorm1d(out_channels)
        self.dropout = nn.Dropout(dropout)
        
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv1d(in_channels, out_channels, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm1d(out_channels)
            )

    def forward(self, x):
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.dropout(out)
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)
        out = self.relu(out)
        return out

class SelfAttention1D(nn.Module):
    def __init__(self, in_channels):
        super(SelfAttention1D, self).__init__()
        self.query = nn.Conv1d(in_channels, in_channels // 8, kernel_size=1)
        self.key = nn.Conv1d(in_channels, in_channels // 8, kernel_size=1)
        self.value = nn.Conv1d(in_channels, in_channels, kernel_size=1)
        self.gamma = nn.Parameter(torch.zeros(1))

    def forward(self, x):
        # x shape: [batch_size, channels, seq_len]
        batch_size, channels, seq_len = x.size()
        
        proj_query = self.query(x).view(batch_size, -1, seq_len).permute(0, 2, 1)  # B x N x C'
        proj_key = self.key(x).view(batch_size, -1, seq_len)  # B x C' x N
        
        energy = torch.bmm(proj_query, proj_key)  # B x N x N
        attention = F.softmax(energy, dim=-1)  # B x N x N
        
        proj_value = self.value(x).view(batch_size, -1, seq_len)  # B x C x N
        out = torch.bmm(proj_value, attention.permute(0, 2, 1))  # B x C x N
        out = out.view(batch_size, channels, seq_len)
        
        out = self.gamma * out + x
        return out, attention

class ExoplanetDetectorNet(nn.Module):
    def __init__(self, input_len=2000, dropout=0.3):
        super(ExoplanetDetectorNet, self).__init__()
        self.input_len = input_len
        
        # Initial 1D CNN Layer
        self.conv1 = nn.Conv1d(1, 32, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm1d(32)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool1d(kernel_size=3, stride=2, padding=1)
        
        # Residual Blocks
        self.res1 = ResidualBlock1D(32, 64, stride=2, dropout=dropout)
        self.res2 = ResidualBlock1D(64, 128, stride=2, dropout=dropout)
        self.res3 = ResidualBlock1D(128, 256, stride=2, dropout=dropout)
        
        # Self Attention Layer
        self.attention = SelfAttention1D(256)
        
        # Global Average Pooling
        self.gap = nn.AdaptiveAvgPool1d(1)
        
        # Fully Connected Layers
        self.fc1 = nn.Linear(256, 64)
        self.fc2 = nn.Linear(64, 1)
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x):
        # Input shape: [batch_size, seq_len]
        if len(x.shape) == 2:
            x = x.unsqueeze(1) # Add channel dimension -> [batch_size, 1, seq_len]
            
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.maxpool(x)
        
        x = self.res1(x)
        x = self.res2(x)
        x = self.res3(x)
        
        x, attn_map = self.attention(x)
        
        x = self.gap(x).squeeze(-1)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = torch.sigmoid(self.fc2(x))
        
        return x, attn_map
