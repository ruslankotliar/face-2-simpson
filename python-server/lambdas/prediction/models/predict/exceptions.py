class NoFaceDetected(Exception):
    def __init__(self, message="No faces are detected in this image."):
        super().__init__(message)

class MultipleFacesDetected(Exception):
    def __init__(self, message="Multiple faces are detected in this image."):
        super().__init__(message)
