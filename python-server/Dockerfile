FROM public.ecr.aws/lambda/python:3.10

COPY requirements.txt requirements.txt

RUN python -m pip install --upgrade pip -vvv
RUN python --version
RUN python -m pip --version
RUN python -m pip install -r requirements.txt

COPY . ./
