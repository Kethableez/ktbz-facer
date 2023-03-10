from src.modules.model.schema import EncodingsDocument, FaceEncodingError
import face_recognition as fr
from werkzeug.datastructures import FileStorage
from src.modules.model.schema import InvalidModelError, FaceNotRecognisedError
import cv2
import numpy as np
import json
from collections import Counter

def staticRecognise(file: FileStorage, model: str):
  if model == 'dlib':
    return recogniseDlib(file)
  else:
    raise InvalidModelError()
  
def recogniseDlib(file: FileStorage):
  data = parseEncodingsData(getEncodingsByModel('dlib'))

  fileBuffer = np.asarray(bytearray(file.stream.read()), dtype='uint8')
  img = cv2.imdecode(fileBuffer, flags=1)
  boxes = fr.face_locations(img, model='hog')
  encodings = fr.face_encodings(img, boxes)
  names = []

  for encoding in encodings:
    votes = fr.compare_faces(data['encodings'], encoding)
    if True in votes:
      n = Counter([name for name, vote in list(zip(data['label'], votes)) if vote == True]).most_common()[0][0]
      names.append(n)

  if len(names) == 0:
    raise FaceNotRecognisedError()
  else:
    return { 'foundId': names[0] }
  
def getEncodingsByModel(model):
  encodingsDocs = EncodingsDocument.objects(model=model).all()
  return [json.loads(doc.to_json()) for doc in encodingsDocs]

def parseEncodingsData(data):
  parsedData = {
    'encodings': [],
    'label': []
  }
  for obj in data:
    parsedData['encodings'].append(obj['encodings'])
    parsedData['label'].append(obj['label'])

  return parsedData

def encodeDLIB(rgbImage, box, label: str):
  encodings = fr.face_encodings(rgbImage, box)
  if (len(encodings) == 0):
    raise FaceEncodingError()
  else:
    newEncodings = EncodingsDocument(**{
      'label': label,
      'model': 'dlib',
      'encodings': list(encodings[0])
    })
    newEncodings.save()
    return { 'message': 'Encodings saved'}
  