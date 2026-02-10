import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { generateGeminiResponse } from '@/lib/gemini';

// Get a specific chat with all messages
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { id } = await params;

        const chat = await Chat.findOne({
            _id: id,
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
    { params }: { params: Promise<{ id: string }> }
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

        const { id } = await params;

        const chat = await Chat.findOne({
            _id: id,
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

        // Generate AI response using Gemini with AI Rules integration
        const aiResponse = await generateGeminiResponse(message, chat.messages);

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

// Delete a chat
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { id } = await params;

        const chat = await Chat.findOneAndDelete({
            _id: id,
            userId: (session.user as any).id,
        });

        if (!chat) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Chat deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete chat error:', error);
        return NextResponse.json(
            { error: 'Failed to delete chat' },
            { status: 500 }
        );
    }
}
