import numpy as np
from torchvision import models, transforms
import torchvision.transforms.functional as TF
import cv2

from .exceptions import NoFaceDetected, MultipleFacesDetected


class Transforms():
    def __init__(self, model_kind='classification'):
        model_kind_dict = {'classification', 'facial_markings'}
        assert model_kind in model_kind_dict, f"No model type named '{model_kind}'"

        self.model_kind = model_kind
        self.facecascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def resize(self, image, img_size):
        image = TF.resize(image, img_size)
        return image

    def crop_face(self, image):

        imgtest = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        faces = self.facecascade.detectMultiScale(imgtest,
                                                  scaleFactor=1.1, minNeighbors=5)

        if len(faces) == 0:
            raise NoFaceDetected()

        left, top, width, height = faces[0]

        image = TF.crop(image, top, left, height, width)
        return image, left, top, width, height, image.size

    def __call__(self, image):
        if self.model_kind == 'classification':
            transformer = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])

            return transformer(image)

        elif self.model_kind == 'facial_markings':
            image, *cropped = self.crop_face(image)
            image = self.resize(image, (224, 224))

            image = image.convert('L')
            image = TF.to_tensor(image)
            image = TF.normalize(image, [0.5], [0.5])
            return image, cropped

        return image