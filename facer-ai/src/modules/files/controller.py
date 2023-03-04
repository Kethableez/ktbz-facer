from flask_smorest import Blueprint
from flask_smorest.fields import Upload
from flask.views import MethodView
from marshmallow import Schema, fields
from src.modules.files.schema import UserIdSchema
from src.common.schema import FileSchema
from src.modules.files.service import uploadFile

filesApi =  Blueprint(
    "Files API",
    __name__,
    url_prefix="/ai/v1/files",
    description="Api to manage files"
)

@filesApi.route('/upload')
class Upload(MethodView):
  
  @classmethod
  @filesApi.arguments(FileSchema, location='files')
  @filesApi.arguments(UserIdSchema, location='form')
  @filesApi.response(200)
  def post(cls, file, userId):
    response = uploadFile(file['file'], userId['userId'])
    return response
