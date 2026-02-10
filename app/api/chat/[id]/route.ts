import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';

// Get a specific chat with all messages
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const chat = await Chat.findOne({
            _id: params.id,
            userId: (session.user as any).id,
        });

        if (!chat) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        return NextResponse.json({ chat }, { status: 200 });
    } catch (error) {
        console.error('Get chat error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chat' },
            { status: 500 }
        );
    }
}

// Add a message to chat and get AI response
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message } = await req.json();

        if (!message?.trim()) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const chat = await Chat.findOne({
            _id: params.id,
            userId: (session.user as any).id,
        });

        if (!chat) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        // Add user message
        chat.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date(),
        });

        // Generate AI response (placeholder)
        const aiResponse = await generateAIResponse(message, chat.messages);

        // Add AI message
        chat.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
        });

        // Update chat title if it's the first message
        if (chat.messages.length === 2) {
            chat.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
        }

        await chat.save();

        return NextResponse.json({ chat }, { status: 200 });
    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

// Placeholder AI response function
// Google Gemini Integration
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateAIResponse(userMessage: string, history: any[]): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return "I'm not fully configured yet! Please add a valid GEMINI_API_KEY to your .env.local file to unlock my full potential.";
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Convert chat history to Gemini format
        // Gemini expects: { role: "user" | "model", parts: [{ text: "..." }] }
        const chatHistory = history.slice(0, -1).map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
}
