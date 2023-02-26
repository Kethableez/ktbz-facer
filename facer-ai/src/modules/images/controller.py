from flask_smorest import Blueprint
from flask_smorest.fields import Upload
from flask.views import MethodView
from marshmallow import Schema, fields
from src.modules.images.schema import FileSchema, UserIdSchema
from src.modules.images.service import uploadFile

imagesApi =  Blueprint(
    "Files API",
    __name__,
    url_prefix="/ai/v1/files",
    description="Api to manage images"
)

@imagesApi.route('/upload')
class Upload(MethodView):
  
  @classmethod
  @imagesApi.arguments(FileSchema, location='files')
  @imagesApi.arguments(UserIdSchema, location='form')
  @imagesApi.response(200)
  def post(cls, file, userId):
    response = uploadFile(file['file'], userId['userId'])
    return response
