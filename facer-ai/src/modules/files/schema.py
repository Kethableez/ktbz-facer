from marshmallow import Schema, fields
from flask_smorest.fields import Upload
import mongoengine as me
from mongoengine import StringField, DateTimeField


class FileSchema(Schema):
  file = Upload()

class UserIdSchema(Schema):
  userId = fields.Str()

class FileDocument(me.Document):
  filename = StringField(required=True)
  userId = StringField(required=True)
  createdAt = DateTimeField(required=True)
  lastModifiedAt = DateTimeField(required=True)