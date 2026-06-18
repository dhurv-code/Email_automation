from pydantic import BaseModel

class EmailLog(BaseModel):
    lead_id:str
    campaign_id:str
    status:str