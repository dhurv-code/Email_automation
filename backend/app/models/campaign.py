from pydantic import BaseModel
class Campaign(BaseModel):
    name:str
    subject:str
    body:str