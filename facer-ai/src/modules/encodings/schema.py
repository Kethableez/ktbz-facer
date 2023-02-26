from mongoengine import StringField, Document, ListField
from werkzeug.exceptions import HTTPException

class FaceEncodingError(HTTPException):
  code = 400
  data = {"message": "Couldn't encode faces, try again"}

class EncodingsDocument(Document):
  meta = { 'collection': 'encodings'}
  encodings = ListField(required=True)
  label = StringField(required=True)
  model = StringField(required=True)
