# from src.rabbit.client import RClient
from src.rabbit.client import ClientRPC

client = ClientRPC(
    url='amqp://admin:admin@localhost:5672',
    routing_key = 'facer-mq'
)