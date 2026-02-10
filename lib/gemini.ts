import { GoogleGenerativeAI } from '@google/generative-ai';
import AIRule from '@/models/AIRule';
import dbConnect from '@/lib/db';

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment variables');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Build system prompt with AI Rules from database
 */
export async function buildSystemPrompt(): Promise<string> {
    try {
        // Ensure database connection
        await dbConnect();

        // Fetch active AI rules from database
        const rules = await AIRule.find({ isActive: true }).sort({ priority: 1 });

        let systemPrompt = `You are a helpful AI learning assistant for DPU Centre for Online Learning. Your role is to help students, faculty, and mentors with their learning journey.

Core Guidelines:
- Be encouraging, supportive, and patient
- Provide clear, accurate, and helpful information
- If you don't know something, admit it honestly
- Use simple language and explain complex concepts clearly
- Encourage critical thinking and learning`;

        // Add custom AI rules if any exist
        if (rules.length > 0) {
            systemPrompt += '\n\nAdditional Guidelines from Administrators:';
            rules.forEach((rule, index) => {
                systemPrompt += `\n${index + 1}. ${rule.description}`;
            });
        }

        return systemPrompt;
    } catch (error) {
        console.error('Error building system prompt:', error);
        // Return default prompt if database query fails
        return `You are a helpful AI learning assistant for DPU Centre for Online Learning. Your role is to help students, faculty, and mentors with their learning journey.`;
    }
}

/**
 * Format chat history for Gemini API
 */
export function formatChatHistory(messages: any[]): any[] {
    return messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }));
}

/**
 * Generate AI response using Gemini
 */
export async function generateGeminiResponse(
    userMessage: string,
    chatHistory: any[]
): Promise<string> {
    if (!genAI) {
        return "I'm not fully configured yet! Please add a valid GEMINI_API_KEY to your .env.local file to unlock my full potential. Visit https://makersuite.google.com/app/apikey to get your API key.";
    }

    try {
        // Get the model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Build system prompt with AI rules
        const systemPrompt = await buildSystemPrompt();

        // Format chat history (exclude the current message)
        const formattedHistory = formatChatHistory(chatHistory.slice(0, -1));

        // Start chat with history and system instruction
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
            },
            systemInstruction: {
                role: 'system',
                parts: [{ text: systemPrompt }]
            },
        });

        // Send message and get response
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error('Gemini API Error Details:', {
            message: error.message,
            stack: error.stack,
            fullError: error
        });

        // Handle specific errors
        if (error.message?.includes('API_KEY_INVALID')) {
            return "My API key seems to be invalid. Please check the GEMINI_API_KEY in your environment variables.";
        }

        if (error.message?.includes('RATE_LIMIT')) {
            return "I'm receiving too many requests right now. Please try again in a moment.";
        }

        if (error.message?.includes('SAFETY')) {
            return "I cannot respond to that message as it may violate safety guidelines. Please rephrase your question.";
        }

        // Return more specific error message
        const errorMsg = error.message || 'Unknown error';
        console.error('Returning error to user:', errorMsg);
        return `I'm having trouble connecting to my brain right now. Error: ${errorMsg}. Please try again later. If this persists, please contact support.`;
    }
}

/**
 * Generate streaming response (for future implementation)
 */
export async function generateGeminiStreamingResponse(
    userMessage: string,
    chatHistory: any[]
): Promise<AsyncGenerator<string, void, unknown>> {
    if (!genAI) {
        throw new Error('Gemini API not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const systemPrompt = await buildSystemPrompt();
    const formattedHistory = formatChatHistory(chatHistory.slice(0, -1));

    const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
        },
        systemInstruction: {
            role: 'system',
            parts: [{ text: systemPrompt }]
        },
    });

    const result = await chat.sendMessageStream(userMessage);

    async function* streamGenerator() {
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            yield chunkText;
        }
    }

    return streamGenerator();
}
