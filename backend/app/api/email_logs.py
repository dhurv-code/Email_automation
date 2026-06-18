from fastapi import APIRouter
from app.database.mongodb import email_logs_collection

router=APIRouter()

@router.get("/")
def get_log():
    logs=[]
    for log in email_logs_collection.find():
        log["_id"]=str(log["_id"])
        logs.append(log)

    return logs