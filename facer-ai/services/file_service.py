import os
from os import path
from mongo import Collection;
from datetime import datetime

class FileService:
  def __init__(self, conn):
    self.repository = Collection(conn, 'images')
    if (not path.exists('./data')):
      os.mkdir('./data')

  def uploadFileHandler(self, file, userId):
    file.save('./data/' + file.filename)
    foundDoc = self.repository.findBy({ 'userId': userId})
    if len(foundDoc) == 0:
      self.repository.saveOne({
        'filename': file.filename,
        'userId': userId,
        'createdAt': datetime.utcnow(),
        'lastModifiedAt': datetime.utcnow()
      })
    else:
      docId = foundDoc[0]['_id']
      self.repository.update(docId, { 'lastModifiedAt': datetime.utcnow()})

    return { 'message': 'File saved with success' }