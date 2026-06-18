from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client=MongoClient(os.getenv("MONGO_URI"))

db=client["email_automation"]

leads_collection=db["leads"]
campaigns_collection=db["campaigns"]
conversations_collection=db["conversations"]
emails_collection=db["emails"]
email_logs_collection = db["email_logs"]