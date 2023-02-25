import pymongo

class Connection:
  def __init__(self, uri: str, name: str):
    self.client = pymongo.MongoClient(uri)
    self.db = self.client[name]


class Collection:
  def __init__(self, connection: Connection, name: str):
    self.collection = connection.db[name]

  def saveOne(self, data):
    self.collection.insert_one(data)

  def findBy(self, query):
    return list(self.collection.find(query))

  def getAll(self):
    return list(self.collection.find())
  
  def update(self, id, data):
    self.collection.update_one({'_id': id}, { '$set': data})
