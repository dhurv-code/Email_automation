from app.services.gmail_service import authenticate
service=authenticate()
message=service.users().messages().list(userId="me",maxResults=5).execute()

for msg in message["messages"]:
    message=service.users().messages().get(userId="me",id=msg["id"]).execute()
# results=service.users().messages().list(userId="me",maxResults=5).execute()
print(message)