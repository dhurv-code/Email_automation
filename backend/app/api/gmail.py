from fastapi import APIRouter
from app.services.gmail_service import GmailService

router=APIRouter()

gmail=GmailService()

@router.get("/emails")
def get_emails():
    return gmail.get_recent_emails()