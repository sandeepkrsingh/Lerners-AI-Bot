# Getting Your Gemini API Key

To enable the AI chatbot functionality, you need a Google Gemini API key.

## Steps to Get Your API Key

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google Account**
   - Use any Google account (Gmail, Workspace, etc.)

3. **Create API Key**
   - Click "Create API Key" button
   - Select "Create API key in new project" (or choose an existing project)
   - Copy the generated API key

4. **Add to Your Project**
   - Open `.env.local` file in your project root
   - Replace `your_api_key_here` with your actual API key:
     ```env
     GEMINI_API_KEY=AIzaSy...your_actual_key_here
     ```

5. **Restart the Development Server**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

## Important Notes

- ✅ **Free Tier Available**: Gemini API has a generous free tier
- ✅ **No Credit Card Required**: You can start using it immediately
- ⚠️ **Keep it Secret**: Never commit your API key to Git
- ⚠️ **Rate Limits**: Free tier has rate limits (15 requests per minute)

## Testing Your Integration

Once you've added your API key:

1. Navigate to http://localhost:3000/chat
2. Create a new conversation
3. Send a message like "Hello, can you help me learn?"
4. The AI should respond using Gemini!

## Troubleshooting

**If you see "I'm not fully configured yet!"**
- Check that your API key is correctly added to `.env.local`
- Make sure you restarted the dev server after adding the key
- Verify there are no extra spaces in the API key

**If you see "API key seems to be invalid"**
- Double-check you copied the entire API key
- Make sure the API key is enabled in Google AI Studio
- Try generating a new API key

## Need Help?

Visit the Google AI documentation: https://ai.google.dev/tutorials/get_started_web
