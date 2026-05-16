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
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });
        this.userInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResizeTextarea();
        });
    }

    updateCharCount() {
        const count = this.userInput.value.length;
        this.charCount.textContent = `${count}/2000`;
        this.charCount.style.color = count > 1900 ? '#c33' : '#999';
    }

    autoResizeTextarea() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = this.userInput.scrollHeight + 'px';
    }

    async handleSend() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.setInputState(false);
        this.addMessage(message, 'user');
        this.conversationHistory.push({ role: 'user', content: message });

        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        this.updateCharCount();

        const loadingElement = this.showLoading();

        try {
            const response = await this.streamBotResponse(loadingElement);
            this.conversationHistory.push({ role: 'assistant', content: response });
        } catch (error) {
            console.error('Error:', error);
            this.removeLoading(loadingElement);
            this.addMessage(this.getErrorMessage(error), 'bot', true);
        } finally {
            this.setInputState(true);
            this.userInput.focus();
        }
    }

    getErrorMessage(error) {
        // Network/connection errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return "I'm having trouble connecting to our service right now. Please check your internet connection and try again. If the problem persists, you can call us directly at (555) 123-4567.";
        }
        
        // Server errors (5xx)
        if (error.message.includes('HTTP error 5')) {
            return "Our chat service is temporarily unavailable. We apologize for the inconvenience! Please try again in a few moments, or call us at (555) 123-4567 for immediate assistance.";
        }
        
        // API rate limiting or authentication errors (4xx)
        if (error.message.includes('HTTP error 429')) {
            return "We're experiencing high volume right now. Please wait a moment and try again. For urgent matters, call us at (555) 123-4567.";
        }
        
        if (error.message.includes('HTTP error 401') || error.message.includes('HTTP error 403')) {
            return "There's a technical issue with our chat service. Please call us at (555) 123-4567 and we'll be happy to help you right away!";
        }
        
        // Timeout errors
        if (error.message.includes('timeout')) {
            return "The request is taking longer than expected. Please try again. If you need immediate help, call us at (555) 123-4567.";
        }
        
        // Generic fallback
        return "I'm having trouble processing your request right now. Please try again in a moment. If you need immediate assistance, call us at (555) 123-4567 or email support@coolbreezeac.com.";
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
    }

    createStreamingBotMessage() {
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box bot-message';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageParagraph = document.createElement('p');
        messageContent.appendChild(messageParagraph);

        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = this.getTimestamp();

        messageBox.appendChild(messageContent);
        messageBox.appendChild(timestamp);
        this.chatMessages.appendChild(messageBox);
        this.scrollToBottom();

        return messageParagraph;
    }

    async streamBotResponse(loadingElement) {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: this.conversationHistory })
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        this.removeLoading(loadingElement);
        const paragraph = this.createStreamingBotMessage();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(data);
                    fullText += parsed.text;
                    paragraph.textContent = fullText;
                    this.scrollToBottom();
                } catch (e) {}
            }
        }

        return fullText;
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

    setInputState(enabled) {
        this.userInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getTimestamp() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => new Chatbot());
