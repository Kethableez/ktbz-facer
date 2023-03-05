import os
from typing import Any
from dotenv import load_dotenv

class EnvVarNotFoundException(Exception):
  pass

class Settings:
  def __init__(self):
    load_dotenv(verbose=True)

  @staticmethod
  def _getEnv(key: str, typeName: type, default: Any = None) -> Any:
    value = os.getenv(key, default)
    if value is None:
      raise EnvVarNotFoundException(f"{key} was not defined")
    return typeName(value)
  
  @property
  def app_port(self) -> int:
    return self._getEnv("APP_PORT", int, 5000)


  @property
  def mongodb_uri(self) -> str:
    return self._getEnv("MONGO_URI", str)
  
  @property
  def cryptoKey(self) -> bytes:
    key = self._getEnv("CRYPTO_KEY", str)
    key = bytes(key, 'utf-8')
    return key