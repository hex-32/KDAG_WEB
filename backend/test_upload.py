import json
import os
from pymongo import MongoClient
import dotenv
dotenv.load_dotenv()

client = MongoClient(f"{os.getenv('MONGODB_URI')}")
db = client[f"{os.getenv('MONGODB_DB')}"]
collection = db["posts"]

with open('data.json') as f:
    file_data = json.load(f)
    collection.insert_many(file_data) 
