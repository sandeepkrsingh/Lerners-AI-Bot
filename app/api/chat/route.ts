import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';

// Get all chats for a user or create a new chat
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const chats = await Chat.find({ userId: (session.user as any).id })
            .sort({ updatedAt: -1 })
            .select('-messages');

        return NextResponse.json({ chats }, { status: 200 });
    } catch (error) {
        console.error('Get chats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chats' },
            { status: 500 }
        );
    }
}

// Create a new chat
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const chat = await Chat.create({
            userId: (session.user as any).id,
            title: 'New Conversation',
            messages: [],
        });

        return NextResponse.json({ chat }, { status: 201 });
    } catch (error) {
        console.error('Create chat error:', error);
        return NextResponse.json(
            { error: 'Failed to create chat' },
            { status: 500 }
        );
    }
}
