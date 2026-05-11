
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)
@app.route("/")
def index():
    return app.send_static_file("index.html")
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
SYSTEM_PROMPT = "You are a helpful, friendly AI assistant. Provide clear, concise, and accurate responses."

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data.get("messages", [])

    def generate():
        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=[{
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"}
            }],
            messages=messages
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {json.dumps({'text': text})}\n\n"
        yield "data: [DONE]\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
