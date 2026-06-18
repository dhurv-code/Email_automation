from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
import os
import re

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly"]
class GmailService:
    def __init__(self):
        self.service=self.authenticate
    def authenticate(self):

        creds = None

        if os.path.exists("token.json"):
            creds = Credentials.from_authorized_user_file(
                "token.json",
                SCOPES
            )

        if not creds:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credential1.json",
                SCOPES
            )

            creds = flow.run_local_server(port=0)

            with open("token.json", "w") as token:
                token.write(creds.to_json())

        service = build(
            "gmail",
            "v1",
            credentials=creds
        )

        return service
    
    def send_email(self,to,subject,body):
        message=MIMEText(body)
        message["to"]=to
        message["subject"]=subject

        raw=base64.urlsafe_b64encode(
            message.as_bytes()
        ).decode()

        message_body={"raw":raw}

        return self.service.users().messages().send(
            userId="me",
            body=message_body
        ).execute()
    
    def get_recent_emails(self,limit=20):
        results=self.service.users().messages().list(
            userId="me",maxResults=limit
        ).execute()

        return results.get("messages",[])
    
    def get_message_details(self, message_id):

        message = self.service.users().messages().get(
            userId="me",
            id=message_id
        ).execute()

        headers = message["payload"]["headers"]

        sender = ""
        subject = ""

        for header in headers:

            if header["name"] == "From":
                sender = header["value"]

            if header["name"] == "Subject":
                subject = header["value"]

        match=re.search(r"<(.+?)>",sender)
        sender_email=(
            match.group(1)
            if match
            else sender
        )
        # email content snipper
        body=message.get("snippet",)

        return {
            "sender": sender,
            "sender_email":sender_email,
            "subject": subject,
            "message": body,
            "status":"pending",
            "ai_reply":""

        }
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build

# SCOPES=["https://www.googleapis.com/auth/gmail.readonly"]

# class GmailService:
#     def __init__(self):
#         flow=InstalledAppFlow.from_client_secrets_file("credential1.json",SCOPES)
#         creds=flow.run_local_server(port=0)

#         self.service=build("gmail","v1",credentials=creds)

#     def get_recent_emails(self,limit=10):
#         result=self.service.users().messages().list(userId="me",maxResults=limit).execute()

#         return result.get("messages",[])




