# AI Chatbot - Box Design

A modern, responsive web-based chatbot with a beautiful box design interface featuring distinct question and answer boxes.

## Features

✨ **Box Design Interface**
- User questions appear in purple gradient boxes on the right
- Bot answers appear in white boxes on the left
- Smooth animations and transitions
- Typing indicator while bot is thinking

🎨 **Modern UI/UX**
- Clean, professional design
- Responsive layout (works on desktop, tablet, and mobile)
- Auto-scrolling chat
- Character counter for input
- Timestamp for each message

🤖 **AI-Powered**
- Integrated with Anthropic's Claude API
- Maintains conversation context
- Error handling and loading states

## Project Structure

```
chatbot-project/
├── index.html      # Main HTML structure
├── styles.css      # Box design styling and animations
├── script.js       # Chat functionality and API integration
├── config.js       # API configuration
└── README.md       # This file
```

## Setup Instructions

### 1. API Key Configuration

Your Anthropic API key is already configured in `config.js`. If you need to change it:

```javascript
const CONFIG = {
    ANTHROPIC_API_KEY: 'your-api-key-here',
    // ... other settings
};
```

### 2. Running the Chatbot

**Option A: Using a Local Server (Recommended)**

Due to CORS restrictions, you need to run the chatbot on a local server:

```bash
# Using Python 3
cd chatbot-project
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open your browser and navigate to: `http://localhost:8000`

**Option B: Using Live Server Extension in VS Code**

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 3. Using the Chatbot

1. Type your message in the input box at the bottom
2. Press Enter or click the send button
3. Wait for the bot's response (you'll see a typing indicator)
4. Continue the conversation!

## Customization

### Changing Colors

Edit `styles.css` to customize the color scheme:

```css
/* User message boxes (currently purple gradient) */
.user-message .message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Bot message boxes (currently white) */
.bot-message .message-content {
    background: #ffffff;
}

/* Header gradient */
.chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjusting Bot Behavior

Edit `config.js` to change the bot's personality:

```javascript
SYSTEM_PROMPT: 'You are a helpful, friendly AI assistant...'
```

### Modifying Layout

- **Chat container size**: Edit `.chat-container` in `styles.css`
- **Message box width**: Edit `.message-box` max-width
- **Font sizes**: Search for `font-size` in `styles.css`

## Features Breakdown

### Box Design Elements

1. **User Messages (Right Side)**
   - Purple gradient background
   - Rounded corners with bottom-right sharp corner
   - Right-aligned with timestamp

2. **Bot Messages (Left Side)**
   - White background with subtle border
   - Rounded corners with bottom-left sharp corner
   - Left-aligned with timestamp

3. **Visual Effects**
   - Fade-in animation for new messages
   - Smooth scrolling
   - Typing indicator with bouncing dots
   - Hover effects on buttons

### Responsive Design

The chatbot automatically adapts to different screen sizes:
- **Desktop**: Full-width boxes with optimal spacing
- **Tablet**: Adjusted box widths
- **Mobile**: Compact layout with larger touch targets

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
- Make sure you're running the chatbot through a local server (not opening the HTML file directly)
- Check that your API key is valid

### API Errors

If the bot doesn't respond:
1. Check your internet connection
2. Verify your API key in `config.js`
3. Check the browser console for error messages
4. Ensure you have API credits available

### Styling Issues

If the boxes don't look right:
- Clear your browser cache
- Check that `styles.css` is loading correctly
- Verify all CSS files are in the same directory as `index.html`

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Security Note

⚠️ **Important**: The API key is currently stored in `config.js` on the client side. For production use, you should:
1. Move API calls to a backend server
2. Never expose your API key in client-side code
3. Implement proper authentication

This current setup is suitable for local development and testing only.

## License

This project is open source and available for personal and educational use.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Verify your API configuration

Enjoy your new chatbot! 🎉