import os
import torch
import sys
from PIL import Image

from model import create_resnet
from timeit import default_timer as timer
from typing import Tuple, Dict

with open("/Users/ruslan_kotliar/Coding/code_projects/face-2-simpson/src/app/api/_models/predict/class_names.txt", "r") as f:
  class_names = [food_name.strip() for food_name in f.readlines()]

model, transformer = create_resnet(num_classes=len(class_names))

model.load_state_dict(
    torch.load(f="/Users/ruslan_kotliar/Coding/code_projects/face-2-simpson/src/app/api/_models/predict/BEST_MODEL",
               map_location=torch.device("cpu"))
)

def predict(img) -> Tuple[Dict, float]:
  start_time = timer()

  img = transformer(img).unsqueeze(0)

  model.eval()
  with torch.inference_mode():
    pred_probs = torch.softmax(model(img), dim=1)

  pred_labels_and_probs = {class_names[i]: float(pred_probs[0][i]) for i in range(len(class_names))}

  end_time = timer()
  pred_time = round(end_time - start_time, 4)

  return pred_labels_and_probs, pred_time


img_path = sys.argv[1] # accessing args
img = Image.open(img_path).convert('RGB')  # accessing img

pred_labels_and_probs, pred_time = predict(img)

print(pred_labels_and_probs, pred_time)
sys.stdout.flush()