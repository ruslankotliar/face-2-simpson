import torch
import torchvision

from torch import nn

def create_resnet(num_classes,
                     seed=42):

  torch.manual_seed(seed)

  weights = torchvision.models.ResNet34_Weights.DEFAULT

  model = torchvision.models.resnet34(weights=weights)

  transformer = weights.transforms()

  for param in model.parameters():
    param.requires_grad = False

  num_features = model.fc.in_features

  model.fc = nn.Linear(num_features, num_classes)

  return model , transformer
