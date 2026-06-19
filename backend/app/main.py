from fastapi import FastAPI
# from app.api.gmail import router as gmail_router
from app.api.leads import router as leads_router
from app.api.campaigns import router as campaign_router
from app.api.conversations import router as conversations_router
from app.api.dashboard import router as dashboard_router
from app.api.email_logs import router as email_logs_router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://email-automation-ruby.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(
#     gmail_router,prefix="/gmail",tags=["gmail"])
app.include_router(leads_router,prefix="/leads",tags=["Leads"])
app.include_router(campaign_router,prefix="/campaigns",tags=["Campaigns"])
app.include_router(conversations_router, prefix="/conversations",tags=["Conversations"])
app.include_router(dashboard_router,prefix="/dashboard",tags=["Dashboard"])
app.include_router(email_logs_router,prefix="/email-logs",tags=["Email Logs"])





@app.get("/")
def home():
    return {"message":"running"}