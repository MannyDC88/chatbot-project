// Configuration file for the chatbot
const CONFIG = {
    // API endpoint points to our local Flask server
    API_ENDPOINT: 'http://localhost:8000/chat',
    
    // Model to use
    MODEL: 'claude-opus-4-5',
    
    // Max tokens for response
    MAX_TOKENS: 1024,
    
    // System prompt
    SYSTEM_PROMPT: 'You are a helpful, friendly AI assistant. Provide clear, concise, and accurate responses.'
};
// Made with Bob