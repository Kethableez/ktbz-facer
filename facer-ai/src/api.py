from flask import Flask
from flask_cors import CORS
from flask_mongoengine import MongoEngine

from src.config import FlaskConf
from src.modules.routes import configureRoutes
# from app.cache import configure_cache
# from app.config import FlaskConfiguration

def createApi():
  api = Flask('facer-ai')
  api.config.from_object(FlaskConf)

  configureCors(api)
  configureMongo(api)
  configureRoutes(api)

  return api

def configureCors(api):
  CORS(api, resources={r"/*": { "origins": "*"}})

def configureMongo(api: Flask):
  MongoEngine(api)