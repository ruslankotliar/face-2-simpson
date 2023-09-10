FROM public.ecr.aws/lambda/python:3.10

COPY requirements.txt requirements.txt

RUN python3.10 -m pip install --upgrade pip
RUN python3.10 -m pip install -r requirements.txt

COPY . ./