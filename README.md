# Face-2-Simpson

Discover which "The Simpsons" character you resemble with our state-of-the-art ML-powered Next.js application.

🚀 [Live Application](https://face-2-simpson.vercel.app/)

## Table of Contents

- [Application Overview](#application-overview)
- [Python ML Models](#python-ml-models)
- [AWS Infrastructure](#aws-infrastructure)
- [Developers](#developers)
- [Getting Started](#getting-started)

## Application Overview

Crafted using Next.js 13 with TypeScript and supercharged by SSR, this application uses ML to identify the Simpson character that an uploaded image most resembles. The dashboard provides rich analytics powered by Chart.js.

### Features

- **Image Prediction**: Find your Simpson character match.
- **Tailwind CSS**: Sleek and modern styling.
- **Dashboard Analytics**:
  - Predicted Character Distribution.
  - Model Accuracy Evolution.
  - Time-based Prediction Analytics.

### Tech Stack

- **Next.js 13**: Enhanced performance and SSR.
- **TypeScript**: Robust application design.
- **MongoDB**: Efficient data management with advanced retrieval.
- **Tailwind CSS**: Responsive UI design.
- **Chart.js**: Dashboard data visualization.

## Python ML Models

### Model Architecture

<img width="1447" alt="diagram" src="https://github.com/ruslankotliar/face-2-simpson/assets/137568373/626674a7-208a-4827-b177-9cfb22b36389">

Our `Face Landmarks model` leverages the power of the ResNet18 architecture, a robust convolutional neural network renowned for its proficiency in image recognition tasks. This specialized model is engineered to discern and precisely locate key facial features, encompassing eyes, nose, lips, and other prominent points on an individual's visage. Its proficiency is the result of rigorous training on a meticulously annotated dataset of facial images, enabling it to master the accurate identification and localization of facial landmarks.

For more details on the Face Landmarks model implementation, refer to the [facial_landmarks_small.ipynb](model_notebooks/facial_landmarks_small.ipynb) file in the `model_notebooks` directory.

#### Main model

The core of the `Simpson Lookalike` model is MobileNet, which serves as a pre-trained convolutional neural network (CNN). MobileNet is well-suited for tasks like image classification and feature extraction. Transfer learning involves fine-tuning MobileNet on a dataset of images that resemble the target characters.

For more details on the Simpson Lookalike model implementation, refer to the [main.ipynb](model_notebooks/main.ipynb) file in the `model_notebooks` directory.


### Data Collection

The model relies on a dataset comprising images of individuals who closely resemble "The Simpsons" characters. Each character category (Homer, Marge, Bart, Lisa) consists of 350 hand-selected images obtained from internet sources. The data collection process involved a [script to search the internet for suitable images](model_notebooks/get_images.ipynb), and manual curation to ensure the quality and relevance of the images.

### Retraining Mechanism

In this project, a sophisticated retraining mechanism has been implemented to ensure that the model remains up-to-date and continues to deliver accurate predictions over time. The primary goal of this mechanism is to keep the model's performance optimized and adaptive to changing data.

#### How it Works

- **Regular Retraining**: The retraining process is scheduled to occur at regular intervals, specifically every three days. This periodicity ensures that the model is continually exposed to new data and can adapt to any emerging trends or variations in the input data.

- **Evaluatio**n: During each retraining cycle, the model is trained anew on the most recent data. After training, the model's performance is evaluated using a test dataset to measure its accuracy.

- **Comparison**: The accuracy of the newly trained model is compared to the accuracy of the previous model. This step is crucial in determining whether the new model is an improvement over the existing one.

- **Decision Making**: A decision-making mechanism is employed to assess whether the newly trained model is superior in terms of accuracy. If the new model exhibits higher accuracy, it replaces the old one as the current working model. Otherwise, the old model is retained.

By implementing this retraining mechanism, this project ensures that the model's predictive capabilities remain robust and dependable, contributing to its long-term success in identifying individuals resembling characters from "The Simpsons."

## AWS Infrastructure

Our setup uses AWS to create a seamless interaction between the ML model deployment and the user.

### Core Components:

1. **AWS Lambda**: Rapid ML model execution via Docker images from AWS ECR.
2. **AWS API Gateway**: RESTful interface to Lambda functions, assuring scalability and security.
3. **AWS ECR**: Docker image storage, integrated with GitHub Actions for automated CI/CD.
4. **AWS S3**: Image storage with secure, direct client uploads via Presigned URLs.

### CI/CD Workflow:

1. GitHub Actions activate upon code pushes.
2. Images are dockerized and pushed to ECR.
3. Lambda functions are updated with the new images.

### Security:

- **Presigned URLs**: Temporary secured links ensuring safe S3 client operations.

## Developers

- [Ruslan Kotliarenko](https://www.linkedin.com/in/ruslan-kotliarenko/) - Application & AWS Infrastructure
- [Danylo Sushko](https://www.linkedin.com/in/danylo-sushko/) - Python ML Models

## Getting Started

Learn how to set up and run the Next.js application and the Python server with AWS Lambda functions locally.

### 📌 Prerequisites

- Yarn package manager
- AWS SAM CLI

### 🖥️ 1. Next.js Application Setup

1. **Navigate to the `next-app` directory**:
    ```bash
    cd next-app
    ```

2. **Install dependencies**:
    ```bash
    yarn
    ```

3. **Start the development server**:
    ```bash
    yarn dev
    ```

Visit [`http://localhost:3000`](http://localhost:3000).

### 🐍 2. Python Server with AWS Lambda Functions

1. **Return to the project root**:
    ```bash
    cd ..
    ```

2. **Enter the `python-server` directory**:
    ```bash
    cd python-server
    ```

3. **Set up AWS SAM CLI** as per the [official documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

4. **Build using the SAM CLI**:
    ```bash
    sam build
    ```

5. **Start the local API**:
    ```bash
    sam local start-api -d 5858 --debug
    ```
