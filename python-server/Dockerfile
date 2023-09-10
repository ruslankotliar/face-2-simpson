FROM public.ecr.aws/lambda/python:3.8

COPY requirements.txt requirements.txt

RUN python3.8 -m pip install --upgrade pip
RUN python3.8 -m pip install -r requirements.txt || (cat /root/.cache/pip/log/debug.log && exit 1)

COPY . ./