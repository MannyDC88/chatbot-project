# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview
Flask backend (server.py) serves static files AND handles /chat API endpoint with SSE streaming. Frontend is vanilla JS with no build step. The chatbot includes an integrated FAQ knowledge base for consistent customer service responses.

## Critical Non-Obvious Patterns

### API Architecture
- **Dual-purpose Flask server**: server.py serves both static files (index.html, etc.) AND the /chat API endpoint
- **SSE streaming required**: /chat endpoint uses Server-Sent Events (text/event-stream), NOT standard JSON responses
- **Response format**: Stream yields `data: {json}\n\n` lines, ends with `data: [DONE]\n\n`
- **API key location**: Must be in .env file (ANTHROPIC_API_KEY), NOT in config.js (config.js is legacy/unused)

### FAQ Knowledge Base Integration
- **FAQ data source**: hvac_faq_data.json contains 25 categorized Q&A entries for CoolBreeze HVAC Solutions
- **Loading mechanism**: FAQ data is loaded at server startup via `load_faq_data()` function
- **System prompt injection**: FAQ content is dynamically built into the system prompt using `build_faq_section()`
- **Categories**: AC Repair, Maintenance, Pricing, Scheduling, General, Emergency Service
- **Usage**: Claude references FAQ answers when customers ask relevant questions, maintaining conversational tone
- **Contact info**: FAQ includes company contact details (phone, email, website, hours, service area)

### Frontend Streaming Implementation
- **Buffer management**: script.js accumulates partial SSE chunks in `buffer` variable, splits on `\n`, keeps last incomplete line
- **Hardcoded endpoint**: script.js line 108 uses '/chat' directly, ignoring CONFIG.API_ENDPOINT from config.js
- **No markdown rendering**: Bot responses are plain text only (textContent, not innerHTML)

### Development Setup
- **Start command**: `python server.py` (or use START_CHATBOT.bat on Windows)
- **Port**: Defaults to 8000, overridable via PORT environment variable
- **CORS**: Enabled for all origins (flask-cors with default settings)

### Model Configuration
- **Model**: claude-sonnet-4-6 (hardcoded in server.py line 26)
- **Prompt caching**: System prompt uses ephemeral cache_control (server.py lines 28-31)
- **Max tokens**: 1024 (hardcoded in server.py line 27)

### Deployment
- **Heroku ready**: Procfile configured for Heroku deployment
- **Static serving**: Flask serves all files from project root as static files

## Testing
No test framework configured. Manual testing via browser required.