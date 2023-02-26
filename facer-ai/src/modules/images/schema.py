from marshmallow import Schema, fields
from flask_smorest.fields import Upload
from mongoengine import StringField, DateTimeField, Document
from werkzeug.exceptions import HTTPException


class FileSchema(Schema):
  file = Upload()

class UserIdSchema(Schema):
  userId = fields.Str()

class FaceDetectionError(HTTPException):
  code = 404
  data = {"message": "Could not find any faces in given image"}

class InvalidUserIdError(HTTPException):
  code = 400
  data = { "message": "Invalid userId"}

class ImageDocument(Document):
  meta = { 'collection': 'images'}
  filename = StringField(required=True)
  userId = StringField(required=True)
  createdAt = DateTimeField(required=True)
  lastModifiedAt = DateTimeField(required=True)