from torchvision import models, transforms
from torch import nn

def create_mobilenet(num_classes,
                     seed=42):
  model = models.mobilenet_v2()
  transformer = transforms.Compose([
      transforms.Resize(256),
      transforms.CenterCrop(224),
      transforms.ToTensor(),
      transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
  ])

  for param in model.parameters():
    param.requires_grad = False

  model.classifier = nn.Sequential(
      nn.Dropout(p=0.2, inplace=True),
      nn.Linear(1280, num_classes, bias=True)
      )

  return model, transformer
