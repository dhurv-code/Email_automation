from fastapi import APIRouter
from app.database.mongodb import(leads_collection,
    campaigns_collection,
    conversations_collection)


router=APIRouter()

@router.get("/stats")
def get_status():
    return {
        "total_leads":leads_collection.count_documents({}),
        "total_campaigns":campaigns_collection.count_documents({}),
        "total_conversations":conversations_collection.count_documents({}),
        "total_replied":conversations_collection.count_documents({"status":"replied"}),
    }