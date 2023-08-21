#Using the base image with python 3.10
FROM python:3.10

#Set our working directory as app
WORKDIR /app 
#Installing python packages pandas, scikit-learn and gunicorn
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# Copy the models directory and app.py files
COPY models ./models
COPY main.py main.py
COPY .env .

#Starting the python application
CMD [ "python3", "main.py"]