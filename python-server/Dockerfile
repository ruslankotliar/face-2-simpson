#Using the base image with python 3.10
FROM python:3.10

#Set our working directory as app
WORKDIR /app 
#Installing python packages pandas, scikit-learn and gunicorn
COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

ENV PYTHONPATH="$PYTHONPATH:/app"

COPY . ./

#Starting the python application
CMD ["uvicorn", "main:asgi_app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
