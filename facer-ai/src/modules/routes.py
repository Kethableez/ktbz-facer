from typing import List

from flask import Flask
from flask_smorest import Api, Blueprint

from src.modules.files.controller import filesApi
from src.modules.model.controler import modelApi

def registerRoutes(api: Flask, routes: List[Blueprint]):
  flaskApi = Api(api)
  for blueprint in routes:
    flaskApi.register_blueprint(blueprint)

def configureRoutes(api: Flask):
  routes = [filesApi, modelApi]
  registerRoutes(api, routes)