FROM public.ecr.aws/lambda/python:3.11

COPY ./lambdas/warmup .
COPY ./constants.py .

RUN pip install -r requirements.txt

ENV PYTHONPATH="$PYTHONPATH"
