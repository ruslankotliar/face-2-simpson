import torch
import random

def set_seeds(seed=42):
  """
    Set random seeds (random.seed and torch.manual_seed)
  """
  random.seed(seed)
  torch.manual_seed(42)
