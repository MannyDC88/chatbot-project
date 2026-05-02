from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=r"C:\Users\ManuelCastillo\AppData\Local\Programs\IBM Bob\.env", override=True)

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1000,
        messages=[{"role": "user", "content": data["message"]}]
    )
    return jsonify({"response": message.content[0].text})

if __name__ == "__main__":
    app.run(port=8000)
    
