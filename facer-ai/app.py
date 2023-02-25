from src.api import createApi
from src.common import settings

api = createApi()

if __name__ == '__main__':
  api.run(port=settings.app_port)