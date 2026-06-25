import numpy as np

def generate_synthetic_transit(
    seq_len=2000, 
    has_transit=True, 
    depth=0.02, 
    period=500.0, 
    duration=80.0, 
    noise_level=0.01, 
    stellar_var_amp=0.03, 
    stellar_var_period=400.0, 
    missing_fraction=0.05, 
    seed=None
):
    """
    Generates a synthetic stellar light curve with optional planetary transit dips,
    stellar variability, noise, and missing observations.
    """
    if seed is not None:
        np.random.seed(seed)
        
    time = np.arange(seq_len, dtype=float)
    
    # 1. Stellar variability (sinusoidal + harmonics)
    stellar_var = stellar_var_amp * np.sin(2 * np.pi * time / stellar_var_period) + \
                  (stellar_var_amp * 0.3) * np.cos(2 * np.pi * time / (stellar_var_period / 3.0))
                  
    # 2. Transit dips
    transit = np.zeros(seq_len)
    if has_transit:
        # Generate periodic transit dips
        num_transits = int(np.ceil(seq_len / period))
        for i in range(num_transits):
            center = int(period * (i + 0.5))
            if center < seq_len:
                start = int(max(0, center - duration // 2))
                end = int(min(seq_len, center + duration // 2))
                # U-shaped dip model
                w = end - start
                if w > 0:
                    transit[start:end] = -depth * np.sin(np.pi * np.arange(w) / w)
                    
    # 3. Noise (Gaussian)
    noise = np.random.normal(0, noise_level, seq_len)
    
    # Combined flux
    flux = 1.0 + stellar_var + transit + noise
    
    # 4. Inject missing observations (NaNs)
    if missing_fraction > 0:
        missing_count = int(seq_len * missing_fraction)
        missing_indices = np.random.choice(seq_len, missing_count, replace=False)
        flux[missing_indices] = np.nan
        
    return {
        "flux": flux.tolist(),
        "time": time.tolist(),
        "has_transit": has_transit,
        "depth": float(depth),
        "period": float(period),
        "duration": float(duration),
        "noise_level": float(noise_level),
        "stellar_var_amp": float(stellar_var_amp)
    }
