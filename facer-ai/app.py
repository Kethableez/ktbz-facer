from src.api import createApi
from src.common import settings
from flask_sockets import Sockets
from flask import request
from flask_socketio import SocketIO, emit

api = createApi()
sockets = Sockets(api)
sock = SocketIO(api, cors_allowed_origins="*")

if __name__ == '__main__':
  api.run(port=settings.app_port)