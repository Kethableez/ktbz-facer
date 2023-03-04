from werkzeug.exceptions import HTTPException
from mongoengine import StringField, ListField, Document
from marshmallow import Schema, fields



class ModelSchema(Schema):
  model = fields.Str()

class InvalidModelError(HTTPException):
  code = 400
  data = { 'message': 'Invalid model name'}

class FaceNotRecognisedError(HTTPException):
  code = 400
  data = { 'message': 'Face not recognised'}


class FaceEncodingError(HTTPException):
  code = 400
  data = {"message": "Couldn't encode faces, try again"}

class EncodingsDocument(Document):
  meta = { 'collection': 'encodings'}
  encodings = ListField(required=True)
  label = StringField(required=True)
  model = StringField(required=True)
