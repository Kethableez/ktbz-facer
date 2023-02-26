from src.api import createApi
from src.common import settings
from flask_socketio import SocketIO
from src.rabbit import client

from flask import request
api = createApi()

if __name__ == '__main__':
  api.run(port=settings.app_port)