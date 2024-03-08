FROM public.ecr.aws/lambda/python:3.10

COPY ./constants.py .

RUN pip install -r requirements.txt

ENV PYTHONPATH="$PYTHONPATH"
