from src.api import createApi
from src.common import settings
from flask_sockets import Sockets
from flask_socketio import SocketIO, emit

api = createApi()
sockets = Sockets(api)
sock = SocketIO(api, cors_allowed_origins="*")

# @sockets.route('/echo')
# def echo(ws):
#   while True:
#     message = ws.recieve()
#     ws.send(message[::-1])

# @sock.
# def echo(ws):
#   while True:
#     message = ws.recieve()
#     ws.send(message[::-1])


if __name__ == '__main__':
  api.run(port=settings.app_port)