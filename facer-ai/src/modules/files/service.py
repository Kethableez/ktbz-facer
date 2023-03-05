import os
from datetime import datetime
from os import path
from cryptography.fernet import Fernet

import cv2
import face_recognition as fr
import numpy as np
from src.modules.model.service import encodeDLIB
from src.modules.files.schema import FaceDetectionError
from werkzeug.datastructures import FileStorage
from src.common import settings


fernet = Fernet(settings.cryptoKey)


def uploadFile(file: FileStorage, userId: str):
  if not path.exists('./data'):
    os.mkdir('./data')

  saved = saveImage(file, userId)

  if saved:
    return { 'message': 'Updated existing file'}
  else:
    raise FaceDetectionError()

def saveImage(file: FileStorage, userId: str) -> bool:
  fileBuffer = np.asarray(bytearray(file.stream.read()), dtype='uint8')
  img = cv2.imdecode(fileBuffer, flags=1)

  boxes = fr.face_locations(img, model='hog')
  if len(boxes) == 0:
    return False
  
  else:
    (x0, x1, x2, x3) = boxes[0]
    encodeDLIB(img, [boxes[0]], userId)
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
  