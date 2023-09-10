FROM public.ecr.aws/lambda/python:3.8
#Set our working directory as app
WORKDIR /app 

COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

ENV PYTHONPATH="$PYTHONPATH:/app"

COPY . ./

CMD ["app.lambda_predict_image"]
