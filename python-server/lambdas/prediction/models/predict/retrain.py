import torch
import torch.nn as nn
from torch.optim import Adam
from torch.optim.lr_scheduler import StepLR
from sklearn.model_selection import train_test_split

from .model import create_mobilenet
from .retrain_functions import *
from .early_stopper import EarlyStopper
from .transform import Transforms

import numpy as np
import os
import random

cwd = os.getcwd()
MODEL_PATH = os.path.join(cwd, "models/predict/simpsons_model.pth")


def set_seeds(seed=42):
    """
    Set random seeds (random.seed and torch.manual_seed)
    """
    random.seed(seed)
    torch.manual_seed(42)


def numpy_to_tensor(array):
    """
    Convert numpy array to tensor.
    """
    preprocessed_images = []
    for image in array[:, 0]:
        # Convert to numpy array and normalize pixel values
        image_array = np.array(image) / 255.0
        # print('IMAGE_ARRAY_SHAPE',image_array.shape)

        # Transpose the dimensions to (channels, height, width)
        image_array = np.transpose(image_array, (2, 0, 1))

        preprocessed_images.append(image_array)

    # Stack the preprocessed images into a tensor
    image_tensor = torch.tensor(preprocessed_images)

    return image_tensor


def build_and_retrain_model(images, class_idx, old_test, num_epochs=10):
    """The function, that retrain a model.

    Args:
      images: numpy.array | Images
      class_idx: Dict() | Dictionary, where "class" is a key and "index" is a value.
      old_test: numpy.array | Array of test images
      num_epochs: int | Number of epochs to train | Default = 10

    Return:
      model.state_dict(): Tensor() | State dict of the model
      model_results: Dict(train_loss, test_loss, train_acc, test_acc) | Dictionary with results of the model for each epoch
    """
    # Constants
    RANDOM_SEED = 42
    IMAGE_SIZE = 224
    BATCH_SIZE = 4
    TEST_SIZE = 0.2
    NUM_OF_CLASSES = len(class_idx.keys())

    # Set random seeds
    set_seeds(RANDOM_SEED)

    train_arr, test_arr = train_test_split(
        images, test_size=TEST_SIZE, random_state=RANDOM_SEED, stratify=images[:, 1]
    )

    # Add previous test files to test_arr
    test_arr = np.vstack([test_arr, old_test])

    train_classes = train_arr[:, 1]
    test_classes = test_arr[:, 1]

    def class_name_to_digit(names, class_idx):
        result = []
        for name in names:
            result.append(class_idx.get(name))
        return np.array(result)

    train_classes_idx = torch.from_numpy(class_name_to_digit(train_classes, class_idx))
    test_classes_idx = torch.from_numpy(class_name_to_digit(test_classes, class_idx))

    # Create transforms
    train_transforms, test_transforms = train_test_transforms(image_size=IMAGE_SIZE)

    # Numpy to tensor
    train_tensor, test_tensor = numpy_to_tensor(train_arr), numpy_to_tensor(test_arr)

    # Create DataLoaders
    (
        train_dataloader,
        test_dataloader,
        train_data,
        test_data,
        class_names,
    ) = create_dataloaders(
        train_arr=train_tensor,
        test_arr=test_tensor,
        train_classes=train_classes_idx,
        test_classes=test_classes_idx,
        train_transformer=train_transforms,
        test_transformer=test_transforms,
        batch_size=BATCH_SIZE,
    )

    # Build a model
    model = create_mobilenet(num_classes=NUM_OF_CLASSES, seed=RANDOM_SEED)

    # Load a state dict of the previous model
    model.load_state_dict(torch.load(f=MODEL_PATH, map_location=torch.device("cpu")))

    # Set an optimizer
    optimizer = Adam(params=model.parameters(), lr=0.001, weight_decay=1e-5)

    # Use learning rate scheduler
    scheduler = StepLR(
        optimizer=optimizer, step_size=3, gamma=0.1, last_epoch=-1, verbose=True
    )

    # Use label smoothing in the loss function
    loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)

    # Set early stopper to prevent overfitting
    early_stopper = EarlyStopper(patience=3, min_delta=0.1)

    # Train the model
    model_results = train(
        model=model,
        train_dataloader=train_dataloader,
        test_dataloader=test_dataloader,
        optimizer=optimizer,
        loss_fn=loss_fn,
        scheduler=scheduler,
        early_stopper=early_stopper,
        epochs=num_epochs,
        device="cpu",
    )
    # TASK (ongoing) ↓
    # Think about "model_results['train_acc'][-1] >= (model_results['test_acc'][-1] * 0.9)"
    # If at any epoch model's test accuracy == MAX(test_acc) AND train accuracy >= test accuracy * 0.9
    # THEN
    # retrain for this epoch
    #
    # Left:
    # and model_results['train_acc'][-1] >= (model_results['test_acc'][-1] * 0.9)
    if model_results["test_acc"][-1] == max(model_results["test_acc"]):
        return model.state_dict(), model_results
    else:
        set_seeds(RANDOM_SEED)
        print("Let's pick the best epoch for our model")
        best_epoch = np.argmax(model_results["test_acc"]) + 1
        print("The best epoch is ", best_epoch)

        model = create_mobilenet(num_classes=NUM_OF_CLASSES, seed=RANDOM_SEED)

        model.load_state_dict(
            torch.load(f=MODEL_PATH, map_location=torch.device("cpu"))
        )

        optimizer = Adam(params=model.parameters(), lr=0.001, weight_decay=1e-5)

        # Use learning rate scheduler
        scheduler = StepLR(
            optimizer=optimizer, step_size=3, gamma=0.1, last_epoch=-1, verbose=True
        )

        # Use label smoothing in the loss function
        loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)

        # Set early stopper to prevent overfitting
        early_stopper = EarlyStopper(patience=3, min_delta=0.1)

        # Train the model
        model_results = train(
            model=model,
            train_dataloader=train_dataloader,
            test_dataloader=test_dataloader,
            optimizer=optimizer,
            loss_fn=loss_fn,
            scheduler=scheduler,
            early_stopper=early_stopper,
            epochs=best_epoch,
            device="cpu",
        )

        return model.state_dict(), model_results
