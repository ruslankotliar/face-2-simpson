import os
import torch
import sys

from PIL import Image
from timeit import default_timer as timer
from typing import Tuple, Dict

from .model import create_mobilenet
from .retrain import build_and_retrain_model

cwd = os.getcwd()
CLASS_NAMES_PATH = os.path.join(cwd, "models/predict/class_names.txt")
MODEL_ACC_PATH = os.path.join(cwd, 'models/predict/model_acc.txt')
MODEL_PATH = os.path.join(cwd, "models/predict/simpsons_model.pth")

def predict(img) -> Tuple[Dict, float]:
  with open(CLASS_NAMES_PATH, "r") as f:
    class_names = [food_name.strip() for food_name in f.readlines()]

    model, transformer = create_mobilenet(num_classes=len(class_names))

    model.load_state_dict(
        torch.load(f=MODEL_PATH,
                  map_location=torch.device("cpu"))
    )
  start_time = timer()

  img = transformer(img).unsqueeze(0)

  model.eval()
  with torch.inference_mode():
    pred_probs = torch.softmax(model(img), dim=1)

  pred_labels_and_probs = {class_names[i]: float(pred_probs[0][i]) for i in range(len(class_names))}

  end_time = timer()
  pred_time = round(end_time - start_time, 4)

  pred_labels_and_probs = dict(sorted(pred_labels_and_probs.items(), key=lambda x:x[1], reverse=True))

  return pred_labels_and_probs, pred_time


def retrain_model(images, new_test):
  print('Retraining model...')
  with open(CLASS_NAMES_PATH, "r") as f:
    class_names = [food_name.strip() for food_name in f.readlines()]

    model, transformer = create_mobilenet(num_classes=len(class_names))

    model.load_state_dict(
      torch.load(f=MODEL_PATH,
                 map_location=torch.device("cpu"))
    )

  with open(MODEL_ACC_PATH, 'r') as f:
    model_results = float(f.read())

  idx_class, class_idx = {}, {}
  for idx, name in enumerate(class_names):
    idx_class[idx] = name
    class_idx[name] = idx

  new_state_dict, new_model_results = build_and_retrain_model(images, class_idx, new_test)

  if new_model_results['test_acc'] > model_results:
    print('Replacing with new model')
    os.remove(MODEL_PATH)
    torch.save(new_state_dict, MODEL_PATH)
    with open(MODEL_ACC_PATH, 'w') as f:
      f.write(new_model_results['test_acc'])
    # Remove images from aws.
  else:
    # shift retrain date
    pass