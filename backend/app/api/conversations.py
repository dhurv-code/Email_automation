from fastapi import APIRouter
from app.services.gmail_service import GmailService
from app.database.mongodb import conversations_collection
from bson import ObjectId
from app.services.gemini_service import generate_reply

router = APIRouter()

@router.post("/sync")
def sync_emails():

    gmail = GmailService()

    messages = gmail.get_recent_emails()

    count = 0

    for msg in messages:

        details = gmail.get_message_details(
            msg["id"]
        )

        conversations_collection.insert_one(
            details
        )

        count += 1

    return {
        "synced": count
    }

@router.get("/")
def get_conversations():

    data = []

    for convo in conversations_collection.find():

        convo["_id"] = str(convo["_id"])

        data.append(convo)

    return data

@router.post("/reply/{conversation_id}")
def generate_ai_reply(conversation_id:str):
    conversation=conversations_collection.find_one(
        {"_id":ObjectId(conversation_id)}
    )
    if not conversation:
        return {"error":"Conversation not found"}
    
    message = conversation.get("message","")
    ai_reply=generate_reply(message)
    conversations_collection.update_one(
        {"_id":ObjectId(conversation_id)},
        {
            "$set":{
                "ai_reply":ai_reply
            }
        }
    )
    return {
        "conversation_id":conversation_id,
        "ai_reply":ai_reply
    }

@router.post("/send/{conversation_id}")
def send_reply(conversation_id:str):
    conversation=conversations_collection.find_one({"_id":ObjectId(conversation_id)})
    if not conversation:
        return{"error":"Conversation not found"}
    
    gmail=GmailService()

    gmail.send_email(
        to=conversation["sender_email"],
        subject=f"Re:{conversation['subject']}",
        body=conversation["ai_reply"]
    )
    conversations_collection.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"status": "replied"}}
    )

    return {
        "message": "Reply Sent"
    }
