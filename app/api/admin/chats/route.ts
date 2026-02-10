import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';

// Get all chats from all users (admin only)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        const chats = await Chat.find()
            .populate('userId', 'name email')
            .sort({ updatedAt: -1 });

        return NextResponse.json({ chats }, { status: 200 });
    } catch (error) {
        console.error('Get all chats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chats' },
            { status: 500 }
        );
    }
}
