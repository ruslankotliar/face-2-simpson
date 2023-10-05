from torchvision import models, transforms
from torch import nn

def create_mobilenet(num_classes):
  model = models.mobilenet_v2()

  for param in model.parameters():
    param.requires_grad = False

  model.classifier = nn.Sequential(
      nn.Dropout(p=0.2, inplace=True),
      nn.Linear(1280, num_classes, bias=True)
      )

  return model

def create_detect_model(num_classes=136):
    class FaceLandmarksExtended(nn.Module):
        def __init__(self, num_classes=136):
            super().__init__()
            self.model = models.resnet18()

            self.model.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)

            self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)

        def forward(self, x):
            x = self.model(x)
            return x

    return FaceLandmarksExtended(num_classes)

