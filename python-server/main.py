import os
import boto3

from flask import Flask, jsonify, request
from dotenv import load_dotenv
from models import predict
from PIL import Image

load_dotenv()
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
AWS_REGION = os.getenv('AWS_REGION')
AWS_BUCKET = os.getenv('AWS_BUCKET')

app = Flask(__name__)

s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, region_name=AWS_REGION)

def get_s3_object(key):
    obj = s3.get_object(Bucket=AWS_BUCKET, Key=key)
    return obj['Body']

@app.route('/predict/simpson', methods=['POST'])
def predict_image():
    key = request.json.get('key')
    print('Request:', key)
    if not key:
        return jsonify({"error": "No key found"}), 400

    file_stream = get_s3_object(key)
    img = Image.open(file_stream)
    
    result = predict(img)

    return jsonify(result)


if __name__ == "__main__":
    port = 8000 #the custom port you want
    app.run(host='0.0.0.0', port=port, debug=True)
