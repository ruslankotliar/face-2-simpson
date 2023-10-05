import os
import torch
import numpy as np

from timeit import default_timer as timer
from typing import Tuple, Dict
from .transform import Transforms


cwd = os.getcwd()
CLASS_NAMES_PATH = os.path.join(cwd, "models/predict/class_names.txt")
PREDICT_MODEL_PATH = os.path.join(cwd, "models/predict/simpsons_model.pth")
FACE_L_SMALL_MODEL_PATH = os.path.join(
    cwd, "models/predict/detect_models/face_landmarks_small.pth"
)
FACE_L_MODEL_PATH = os.path.join(cwd, "models/predict/detect_models/face_landmarks.pth")

# Load class names once
with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = [name.strip() for name in f.readlines()]


def predict(img) -> Tuple[Dict, float]:
    from .model import create_mobilenet

    model = create_mobilenet(len(CLASS_NAMES))
    transformer = Transforms("classification")

    model.load_state_dict(torch.load(f=PREDICT_MODEL_PATH, map_location=torch.device("cpu")))

    img = transformer(img).unsqueeze(0)

    start_time = timer()

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


def back_to_normal(points, left, top, width, height):
    points[:, 0] = points[:, 0] * width / 224 + left
    points[:, 1] = points[:, 1] * height / 224 + top

    return points


def detect_face(image, transforms=Transforms("facial_markings")):
    from .model import create_detect_model

    model1 = create_detect_model(10)
    model1.load_state_dict(
        torch.load(f=FACE_L_SMALL_MODEL_PATH, map_location=torch.device("cpu"))
    )

    model2 = create_detect_model()
    model2.load_state_dict(
        torch.load(f=FACE_L_MODEL_PATH, map_location=torch.device("cpu"))
    )

    target_image, (left, top, width, height, image_size) = transforms(image)
    target_image = target_image.unsqueeze(0)

    model1.eval()
    with torch.inference_mode():
        model1_preds = model1(target_image)
        model1_preds = back_to_normal(
            np.array(model1_preds[0]).reshape(-1, 2), left, top, width, height
        )

    model2.eval()
    with torch.inference_mode():
        model2_preds = (model2(target_image) + 0.5) * 224
        model2_preds = model2_preds.view(-1, 68, 2)

        model2_preds = back_to_normal(
            model2_preds[0].clone().detach().numpy(), left, top, width, height
        )

    return model1_preds.tolist(), model2_preds.tolist()
