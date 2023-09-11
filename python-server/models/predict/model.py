import torch
import torchvision
from torch import nn

def create_mobilenet(num_classes,
                     seed=42):
  torch.manual_seed(seed)
  model = torchvision.models.mobilenet_v2()

  for param in model.parameters():
    param.requires_grad = False

  model.classifier = nn.Sequential(
      nn.Dropout(p=0.2, inplace=True),
      nn.Linear(1280, num_classes, bias=True)
      )

  return model
