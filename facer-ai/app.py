from flask import Flask, request, json
from flask_cors import CORS
from flask_restful import Api
import os
from os import path
from mongo import Collection, Connection;
from services.file_service import FileService
from werkzeug.exceptions import HTTPException

app = Flask(__name__)
cors = CORS(app, resources={r"/ai/v1/*": { "origins": "*"}})
api = Api(app)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

URI = 'mongodb://localhost:27017'
DB_NAME = 'facer'
IMAGES = 'images'

connection = Connection(URI, DB_NAME)
imagesCollection = Collection(connection, IMAGES)

fileService = FileService(connection)

@app.errorhandler(HTTPException)
def handleException(e):
  response = e.get_response()
  response.data = json.dumps({
    'code': e.code,
    'name': e.name,
    'description': e.description
  })
  response.content_type = 'application/json'
  return response

@app.get('/ai/v1/health')
def healthcheck():
  return { 'message': "Up and running"}

# Limit image size
@app.post('/ai/v1/files/upload')
def uploadFile():
  file = request.files['file']
  userId = request.form['userId']
  try:
    return fileService.uploadFileHandler(file, userId)
  except Exception as e:
    return {'message': str(e) }, 400
    
  
if __name__ =='__main__':
  app.run(port=5000)