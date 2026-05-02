// Chatbot functionality
class Chatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.charCount = document.getElementById('charCount');
        this.conversationHistory = [];
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });
        this.userInput.addEventListener('input', () => this.updateCharCount());
        
        // Auto-resize textarea
        this.userInput.addEventListener('input', () => this.autoResizeTextarea());
    }

    updateCharCount() {
        const count = this.userInput.value.length;
        this.charCount.textContent = `${count}/2000`;
        
        if (count > 1900) {
            this.charCount.style.color = '#c33';
        } else {
            this.charCount.style.color = '#999';
        }
    }

    autoResizeTextarea() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = this.userInput.scrollHeight + 'px';
    }

    async handleSend() {
        const message = this.userInput.value.trim();
        
        if (!message) return;
        
        // Disable input while processing
        this.setInputState(false);
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        this.updateCharCount();
        
        // Show loading indicator
        const loadingElement = this.showLoading();
        
        try {
            // Get bot response
            const response = await this.getBotResponse(message);
            
            // Remove loading indicator
            this.removeLoading(loadingElement);
            
            // Add bot response to chat
            this.addMessage(response, 'bot');
            
        } catch (error) {
            console.error('Error:', error);
            this.removeLoading(loadingElement);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot', true);
        } finally {
            // Re-enable input
            this.setInputState(true);
            this.userInput.focus();
        }
    }

    addMessage(text, sender, isError = false) {
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${sender}-message${isError ? ' error-message' : ''}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;
        messageContent.appendChild(messageParagraph);
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = this.getTimestamp();
        
        messageBox.appendChild(messageContent);
        messageBox.appendChild(timestamp);
        
        this.chatMessages.appendChild(messageBox);
        this.scrollToBottom();
        
        // Add to conversation history (for context)
        if (!isError) {
            this.conversationHistory.push({
                role: sender === 'user' ? 'user' : 'assistant',
                content: text
            });
        }
    }

    showLoading() {
        const template = document.getElementById('loadingTemplate');
        const loadingElement = template.content.cloneNode(true).firstElementChild;
        this.chatMessages.appendChild(loadingElement);
        this.scrollToBottom();
        return this.chatMessages.lastElementChild;
    }

    removeLoading(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    async getBotResponse(userMessage) {
        // Prepare messages for API
        const messages = [
            ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: userMessage }
        ];

     const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage })
});
const data = await response.json();
return data.response;
    }

    setInputState(enabled) {
        this.userInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    getTimestamp() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

// Made with Bob
