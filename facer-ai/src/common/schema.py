from marshmallow import Schema
from flask_smorest.fields import Upload

class FileSchema(Schema):
  file = Upload()