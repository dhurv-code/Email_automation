from fastapi import APIRouter
from app.models.leads import Lead
from app.database.mongodb import leads_collection
from bson import ObjectId

router = APIRouter()

@router.post("/")
def create_lead(lead:Lead):
    lead_dict=lead.model_dump()
    leads_collection.insert_one(lead_dict)

    return{
        "message":"Lead Added"
    }

@router.get("/")
def get_leads():
    leads=[]
    for lead in leads_collection.find():
        lead["_id"]=str(lead["_id"])
        leads.append(lead)
    return leads


@router.delete("/{lead_id}")
def delete_lead(lead_id:str):
    leads_collection.delete_one(
        {"_id":ObjectId(lead_id)}
    )
    return {"message":"Lead Deleted"}
