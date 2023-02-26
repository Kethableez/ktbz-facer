from flask import Flask
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask_socketio import SocketIO
from src.config import FlaskConf
from src.modules.routes import configureRoutes
from time import sleep
from src.rabbit import client

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