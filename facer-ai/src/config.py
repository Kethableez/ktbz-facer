from src.common import settings

class FlaskConf:
  API_TITLE = 'Facer AI'
  API_VERSION = 'v1.0.1'
  OPENAPI_VERSION = "3.0.3"

  MONGO_SETTINGS = {
    "host": settings.mongodb_uri
  }