from fastapi import APIRouter
from app.models.leads import Lead
from app.database.mongodb import leads_collection

router = APIRouter()

@router.post("/")
def create_lead(lead:Lead):
    lead_dict=lead.model_dump()
    leads_collection.insert_one(lead_dict)

    return{
        "message":"Lead Added"
    }
