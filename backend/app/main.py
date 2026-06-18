from fastapi import FastAPI
from app.api.gmail import router as gmail_router
from app.api.leads import router as leads_router
from app.api.campaigns import router as campaign_router
from app.api.conversations import router as conversations_router
from app.api.dashboard import router as dashboard_router
from app.api.email_logs import router as email_logs_router


app=FastAPI()

app.include_router(
    gmail_router,prefix="/gmail",tags=["gmail"]
)
app.include_router(leads_router,prefix="/leads",tags=["Leads"])
app.include_router(campaign_router,prefix="/campaign",tags=["Campaigns"])
app.incude_router(conversations_router, prefix="/conversations",tags=["Conversations"])
app.include_router(dashboard_router,prefix="/dashboard",tags=["Dashboard"])
app.include_router(email_logs_router,prefix="/email-logs",tags=["Email Logs"])





@app.get("/")
def home():
    return {"message":"running"}