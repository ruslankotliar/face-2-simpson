import os
import torch

from timeit import default_timer as timer
from typing import Tuple, Dict


cwd = os.getcwd()
CLASS_NAMES_PATH = os.path.join(cwd, "models/predict/class_names.txt")
MODEL_PATH = os.path.join(cwd, "models/predict/simpsons_model.pth")

# Load class names once
with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = [name.strip() for name in f.readlines()]


def predict(img) -> Tuple[Dict, float]:
    from .model import create_mobilenet

    model, transformer = create_mobilenet(len(CLASS_NAMES))

    model.load_state_dict(torch.load(f=MODEL_PATH, map_location=torch.device("cpu")))

    start_time = timer()

    img = transformer(img).unsqueeze(0)
    model.eval()

    with torch.inference_mode():
        pred_probs = torch.softmax(model(img), dim=1)

    pred_labels_and_probs = {
        CLASS_NAMES[i]: float(pred_probs[0][i]) for i in range(len(CLASS_NAMES))
    }

    end_time = timer()
    pred_time = round((end_time - start_time) * 1000)

    return pred_labels_and_probs, pred_time


def retrain_model(images, old_test, old_accuracy):
    from .retrain import build_and_retrain_model
    from .retrain_functions import train_test_transforms
    from PIL import Image

    print("Retraining model...")

    idx_class, class_idx = {}, {}
    for idx, name in enumerate(CLASS_NAMES):
        idx_class[idx] = name
        class_idx[name] = idx

    new_state_dict, new_model_results = build_and_retrain_model(
        images, class_idx, old_test
    )
    new_accuracy = new_model_results["test_acc"][-1]
    print("New model accuracy:\n", new_accuracy)

    if new_accuracy > old_accuracy:
        print("Replacing with new model")
        print(
            f"The previous model test accuracy was {old_accuracy}\nNew model test accuracy is {new_accuracy}"
        )
        # DO NOT UNCOMMENT THIS UNTIL THE WHOLE PROJECT IS DONE
        # os.remove(MODEL_PATH)
        # torch.save(new_state_dict, MODEL_PATH)
    else:
        print("-" * 30)
        print("The previous model is better.\nKeeping the old model.")
        print(
            f"The previous model test accuracy was {old_accuracy}\nNew model test accuracy is {new_accuracy}"
        )

    return new_accuracy
