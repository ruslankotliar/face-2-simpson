FROM public.ecr.aws/lambda/python:3.11

COPY ./lambdas/prediction .
COPY ./utils/s3_client/app.py ./utils/s3_client.py
COPY ./utils/s3_client/__init__.py ./utils/__init__.py
COPY ./constants.py .

RUN yum clean all && \
    yum update -y && \
    yum -y install mesa-libGL

RUN pip install -r requirements.txt

ENV PYTHONPATH="$PYTHONPATH"
