FROM public.ecr.aws/lambda/python:3.10

RUN pip install torch==2.0.0
RUN pip install torchvision==0.15.1
RUN pip install python-dotenv==0.21.0
RUN pip install boto3==1.28.30
RUN pip install numpy==1.23.5
RUN pip install scikit-learn==1.2.2
RUN pip install tqdm==4.66.1

# COPY requirements.txt ./
# RUN pip install -r requirements.txt

COPY . ./
