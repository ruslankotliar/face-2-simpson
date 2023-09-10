FROM public.ecr.aws/lambda/python:3.10

COPY requirements.txt requirements.txt

RUN python3.10 -m pip3 install --upgrade pip3 -vvv
RUN python3.10 --version
RUN python3.10 -m pip3 --version
RUN python3.10 -m pip3 install -r requirements.txt

COPY . ./