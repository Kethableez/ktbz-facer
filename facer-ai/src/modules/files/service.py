import os
from os import path
from datetime import datetime
from src.modules.files.schema import FileDocument
from typing import Type

from flask_mongoengine import Document

def uploadFile(file, userId):
  if not path.exists('./data'):
    os.mkdir('./data')
  
  file.save('./data/' + file.filename)

  existingDocument = findFileByUserId(userId)
  if existingDocument == None:
    saveFile(file.filename, userId)
    return { 'message': 'Uploaded new file'}
  else:
    updateFile(existingDocument)
    return { 'message': 'Updated existing file'}
  
def saveFile(filename: str, userId: str):
  newFile = FileDocument(**{
    'filename': filename,
    'userId': userId,
    'createdAt': datetime.utcnow(),
    'lastModifiedAt': datetime.utcnow()
  })
  newFile.save()

def updateFile(fileDoc: Type[FileDocument]):
  fileDoc.update(**{ 'lastModifiedAt': datetime.utcnow()})
  fileDoc.save()


def findFileByUserId( userId: str ) -> Document:
  return FileDocument.objects(userId=userId).first()
  