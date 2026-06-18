from app.database.mongodb import(
    leads_collection,campaigns_collection,email_logs_collection
)
from app.services.gmail_service import GmailService
from bson import ObjectId

class CampaignService:
    @staticmethod
    def start_campaign(campaign_id:str):
        campaign = campaigns_collection.find_one(
            {"_id": ObjectId(campaign_id)}
        )
        if not campaign:
            return {"error":"Campaign not found"}
        gmail=GmailService()
        leads=leads_collection.find()

        sent_count=0
        for lead in leads:
            body=campaign["body"].replace("{name}",lead["name"])
            
            gmail.send_email(
                to=lead["email"],
                subject=campaign["subject"],
                body=body
            )
            email_logs_collection.insert_one({
                "lead_id": str(lead["_id"]),
                "campaign_id": campaign_id,
                "status": "sent"
            })
            sent_count+=1

            return {
                "message":"Campaign completed",
                "emails_sent":sent_count
            }