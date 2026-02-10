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
async function generateAIResponse(userMessage: string, history: any[]): Promise<string> {
    // TODO: Integrate with OpenAI, Gemini, or other AI service
    // This is a placeholder that simulates AI responses

    const responses = [
        "I'm here to help you with your learning! Could you please provide more details about what you'd like to learn?",
        "That's a great question! Let me help you understand this better.",
        "I can assist you with that. Here's what you need to know...",
        "Let me break this down for you in a simple way.",
        "Excellent! I'm happy to help you learn about this topic.",
    ];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a contextual response based on message content
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        return "Hello! I'm your learner assistance bot. How can I help you with your studies today?";
    }

    if (userMessage.toLowerCase().includes('thank')) {
        return "You're welcome! Feel free to ask if you have any other questions.";
    }

    // Return a random helpful response
    return responses[Math.floor(Math.random() * responses.length)];
}
