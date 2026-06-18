from pydantic import BaseModel

class Conversation(BaseModel):
    sender:str
    subject:str
    message:str
    ai_reply:str=""