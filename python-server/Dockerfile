FROM public.ecr.aws/lambda/python:3.10

RUN pip install torch==2.0.0 torchvision==0.15.1 python-dotenv==0.21.0 boto3==1.28.30 numpy==1.23.5 scikit-learn==1.2.2 tqdm==4.66.1

# does not work with requirements.txt
# COPY requirements.txt ./
# RUN pip install -r requirements.txt

COPY . ./
