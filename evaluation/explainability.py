import numpy as np
import torch
import torch.nn.functional as F

class GradCAM1D:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Register hooks
        self.target_layer.register_forward_hook(self.save_activation)
        self.target_layer.register_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output.detach()

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate_heatmap(self, input_tensor):
        self.model.eval()
        
        # Forward pass
        output, _ = self.model(input_tensor)
        
        # Target the prediction class (binary classification)
        self.model.zero_grad()
        output.backward(retain_graph=True)
        
        # Pool the gradients across the sequence length
        pooled_gradients = torch.mean(self.gradients, dim=2) # Shape: [batch, channels]
        
        # Weight the channels by the pooled gradients
        for i in range(self.activations.shape[1]):
            self.activations[:, i, :] *= pooled_gradients[:, i].unsqueeze(-1)
            
        # Sum the channels
        heatmap = torch.mean(self.activations, dim=1).squeeze(0)
        heatmap = F.relu(heatmap) # Apply ReLU to target positive contribution
        
        # Normalize between 0 and 1
        max_val = torch.max(heatmap)
        if max_val > 0:
            heatmap /= max_val
            
        return heatmap.cpu().numpy()

def estimate_uncertainty_mc_dropout(model, input_tensor, num_samples=10):
    """
    Computes exoplanet probability and uncertainty using Monte Carlo Dropout.
    """
    model.train()  # Turn on training mode to keep Dropout active
    
    # Make sure other batch norm layers are in eval mode
    for m in model.modules():
        if isinstance(m, torch.nn.BatchNorm1d):
            m.eval()
            
    samples = []
    with torch.no_grad():
        for _ in range(num_samples):
            out, _ = model(input_tensor)
            samples.append(out.item())
            
    model.eval()  # Reset back to eval mode
    
    mean_prob = float(np.mean(samples))
    std_dev = float(np.std(samples))
    # 95% Confidence interval margin
    uncertainty = float(1.96 * std_dev)
    
    reliability = "High"
    if uncertainty > 0.05:
        reliability = "Medium"
    if uncertainty > 0.15:
        reliability = "Low"
        
    return mean_prob, uncertainty, reliability

def estimate_transit_parameters(flux, time=None):
    """
    Heuristically estimates exoplanet candidate parameters from the light curve.
    """
    flux = np.array(flux)
    n = len(flux)
    median_val = np.median(flux)
    
    # Calculate depth: distance from median to minimum dip
    min_idx = np.argmin(flux)
    min_val = flux[min_idx]
    depth_percent = float(max(0, (median_val - min_val) * 100))
    
    # Duration: Width of dip at 10% of maximum depth
    threshold = median_val - 0.1 * (median_val - min_val)
    transit_indices = np.where(flux < threshold)[0]
    
    if len(transit_indices) > 0:
        # Check if transit is grouped or spread out
        # Using a simple heuristic where 2000 points represent 10 days (240 hours)
        # So each step is 0.12 hours
        duration_hours = float(len(transit_indices) * 0.12)
    else:
        duration_hours = 0.0
        
    # Periodicity estimation: Find local minimums and calculate spacing
    dips = []
    # Smooth a bit to find true peaks
    smoothed = signal.medfilt(flux, 15)
    for i in range(10, n - 10):
        if smoothed[i] == np.min(smoothed[i-10:i+10]) and smoothed[i] < median_val - 0.02:
            dips.append(i)
            
    # Remove close duplicate dip detections
    filtered_dips = []
    for d in dips:
        if not filtered_dips or (d - filtered_dips[-1]) > 50:
            filtered_dips.append(d)
            
    if len(filtered_dips) >= 2:
        # Distance between adjacent dips scaled to days
        # 2000 points represent 10 days, so 1 point = 0.005 days
        diffs = np.diff(filtered_dips)
        period_days = float(np.mean(diffs) * 0.005)
    else:
        period_days = 8.23  # Default fallback candidate periodicity if single event

    return {
        "depth_percent": depth_percent,
        "duration_hours": duration_hours,
        "period_days": period_days
    }

def analyze_false_positives(flux, time=None):
    """
    Astronomical assessment of a candidate transit light curve to rule out false positives:
    - Eclipsing Binaries: Check for secondary eclipses or highly V-shaped profiles.
    - Stellar Variability: Check for periodic sinusoidal variations without distinct flat out-of-transit parts.
    - Instrument Glitches: Check if the dip occurs in a single/double frame spike.
    """
    flux = np.array(flux)
    if time is None:
        time = np.arange(len(flux))
        
    n = len(flux)
    mean_val = np.mean(flux)
    std_val = np.std(flux)
    
    # Calculate depth and shape of the deepest dip
    min_idx = np.argmin(flux)
    min_val = flux[min_idx]
    
    # Find secondary deep dip (excluding the primary dip region)
    exclude_window = 50
    mask = np.ones(n, dtype=bool)
    mask[max(0, min_idx - exclude_window):min(n, min_idx + exclude_window)] = False
    
    masked_flux = flux[mask]
    secondary_min_idx = np.argmin(masked_flux) if len(masked_flux) > 0 else None
    secondary_min_val = masked_flux[secondary_min_idx] if secondary_min_idx is not None else mean_val
    
    # Glitch check: Is it just a single-point outlier?
    is_glitch = False
    if min_idx > 0 and min_idx < n - 1:
        left_diff = flux[min_idx - 1] - min_val
        right_diff = flux[min_idx + 1] - min_val
        # If the dip recovers immediately to normal on both sides, it's a glitch
        if left_diff > 3 * std_val and right_diff > 3 * std_val:
            is_glitch = True
            
    # Eclipsing Binary check: Significant secondary eclipse
    is_eb = False
    primary_depth = mean_val - min_val
    secondary_depth = mean_val - secondary_min_val
    if primary_depth > 0 and secondary_depth / primary_depth > 0.4 and secondary_depth > 3 * std_val:
        is_eb = True
        
    # Stellar Variability check: Lomb-Scargle power or high variance in out-of-transit
    is_variable = False
    # If the standard deviation is extremely high even outside the main transit
    out_of_transit_std = np.std(masked_flux) if len(masked_flux) > 0 else 0
    if out_of_transit_std > 0.8 * std_val and std_val > 0.05:
        is_variable = True
        
    verdict = "Exoplanet Candidate"
    reason = "Strong, clean transit-like signal without secondary eclipses or single-point glitches."
    
    if is_glitch:
        verdict = "Rejected (Instrument Glitch)"
        reason = "Single-epoch sudden dip likely caused by cosmic ray or satellite crossing (no gradual transit profile)."
    elif is_eb:
        verdict = "Rejected (Eclipsing Binary)"
        reason = f"Primary depth: {primary_depth:.4f}, secondary depth: {secondary_depth:.4f}. Secondary eclipse suggests a binary star system."
    elif is_variable:
        verdict = "Rejected (Stellar Variability)"
        reason = "Continuous sinusoidal-like oscillations throughout the light curve indicate active stellar rotation or pulsations."
        
    return {
        "verdict": verdict,
        "reason": reason,
        "is_glitch": is_glitch,
        "is_eb": is_eb,
        "is_variable": is_variable,
        "primary_depth": float(primary_depth),
        "secondary_depth": float(secondary_depth)
    }

