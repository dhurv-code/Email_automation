from pydantic import BaseModel

class Lead(BaseModel):
    name:str
    email:str
    company:str