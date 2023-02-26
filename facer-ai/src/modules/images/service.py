import os
from datetime import datetime
from os import path
from typing import Type
from cryptography.fernet import Fernet

import cv2
import face_recognition as fr
import numpy as np
from flask_mongoengine import Document
from src.modules.encodings.service import encodeDLIB
from src.modules.images.schema import FaceDetectionError, ImageDocument, InvalidUserIdError
from src.rabbit import client
from werkzeug.datastructures import FileStorage
from src.common import settings

fernet = Fernet(settings.cryptoKey)


def uploadFile(file: FileStorage, userId: str):
  if not path.exists('./data'):
    os.mkdir('./data')

  payload = client.send('file-process.is-requested', { 'userId': userId })
  if payload['requested']:
    if validateImg(file, userId):
      existingDocument = findFileByUserId(userId)
      if existingDocument == None:
        saveFile(file.filename, userId)
        client.send('file-process.process-end', { 'status': 'success', 'userId': userId })
        return { 'message': 'Uploaded new file'}
      else:
        updateFile(existingDocument)
        client.send('file-process.process-end', { 'status': 'success', 'userId': userId })
        return { 'message': 'Updated existing file'}
    else:
      client.send('file-process.process-end', { 'status': 'failed', 'userId': userId })
      raise FaceDetectionError()
  else:
    raise InvalidUserIdError()




def saveFile(filename: str, userId: str):
  newFile = ImageDocument(**{
    'filename': filename,
    'userId': userId,
    'createdAt': datetime.utcnow(),
    'lastModifiedAt': datetime.utcnow()
  })
  newFile.save()

def updateFile(fileDoc: Type[ImageDocument]):
  fileDoc.update(**{ 'lastModifiedAt': datetime.utcnow()})
  fileDoc.save()


def findFileByUserId( userId: str ) -> Document:
  return ImageDocument.objects(userId=userId).first()

def validateImg(file: FileStorage, userId: str) -> bool:
  fileBuffer = np.asarray(bytearray(file.stream.read()), dtype='uint8')
  img = cv2.imdecode(fileBuffer, flags=1)

  boxes = fr.face_locations(img, model='hog')
  if len(boxes) == 0:
    return False
  
  else:
    (x0, x1, x2, x3) = boxes[0]
    cropped = img[x0:x2, x3:x1]
    cropped = cv2.resize(cropped, (500, 500))
    encryptAndSave(cropped, file.filename)
    return True
  
def encryptAndSave(croppedImg, filename):
  ext = '.' + filename.split('.')[-1]
  _, imgBuff = cv2.imencode(ext, croppedImg)
  encryptedImg = fernet.encrypt(imgBuff.tobytes())
  with open('./data/{}'.format(filename), 'wb') as f:
    f.write(encryptedImg)
  