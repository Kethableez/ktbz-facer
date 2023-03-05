from flask.views import MethodView
from flask_smorest import Blueprint
from src.common.schema import FileSchema
from src.modules.model.schema import ModelSchema
from src.modules.model.service import staticRecognise

modelApi = Blueprint(
    "Model API",
    __name__,
    url_prefix="/ai/v1/model",
    description="Api to manage images"
)

@modelApi.route('/static-recognise')
class Recognise(MethodView):
  
  @classmethod
  @modelApi.arguments(FileSchema, location='files')
  @modelApi.arguments(ModelSchema, location='form')
  @modelApi.response(200)
  def post(cls, file, model):
    response = staticRecognise(file['file'], model['model'])
    return response