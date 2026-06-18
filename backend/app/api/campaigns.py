from fastapi import APIRouter
from app.models.campaign import Campaign
from app.database.mongodb import campaigns_collection
from app.services.campaign_service import CampaignService
from bson import ObjectId


router = APIRouter()

@router.post("/")
def create_campaign(campaign: Campaign):

    campaign_dict = campaign.model_dump()

    result=campaigns_collection.insert_one(campaign_dict)

    return {"campaign_id":str(result.inserted_id)}

@router.post("/start/{campaign_id}")
def start_campaign(campaign_id:str):
    return CampaignService.start_campaign(campaign_id)

@router.get("/")
def get_campaigns():
    campaigns=[]
    for campaign in campaigns_collection.find():
        campaign["_id"]=str(campaign["_id"])
        campaigns.append(campaign)

    return campaigns

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id:str):

    campaigns_collection.delete_one(
        {"_id":ObjectId(campaign_id)}
    )

    return {"message":"Campaign Deleted"}