from src.api import createApi
from src.common import settings

api = createApi()
# socket = SocketIO(api, cors_allowed_origins="*", async_mode=None)

# @socket.on('test')
# def test(message):
#   print(message)
#   with open('./data/test-socket.jpeg', 'wb') as f:
  
#     f.write(bytearray(message))
#   # return {'message': 'Ty kurwo'}
#   socket.emit('test', {'message': 'ty kurwo'})

if __name__ == '__main__':
  api.run(host="0.0.0.0", port=settings.app_port)
  # socket.run(api, debug=True)