from typing import List

from flask import Flask
from flask_smorest import Api, Blueprint

from src.modules.images.controller import imagesApi

def registerRoutes(api: Flask, routes: List[Blueprint]):
  flaskApi = Api(api)
  for blueprint in routes:
    flaskApi.register_blueprint(blueprint)

def configureRoutes(api: Flask):
  routes = [imagesApi]
  registerRoutes(api, routes)