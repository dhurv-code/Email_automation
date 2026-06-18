import google.generativeai as genai
import os

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def generate_reply(message):

    prompt = f"""
    Reply professionally to:

    {message}
    """

    response = model.generate_content(
        prompt
    )

    return response.text