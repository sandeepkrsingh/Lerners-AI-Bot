import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Corpus from '@/models/Corpus';

// Get all corpus items
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const items = await Corpus.find().sort({ createdAt: -1 });
        return NextResponse.json({ items }, { status: 200 });
    } catch (error) {
        console.error('Get corpus error:', error);
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

// Create new corpus item
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { title, type, sourceType, content, description, webLink, fileData, fileName, fileSize } = await req.json();

        if (!title || !type || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const itemData: any = {
            title,
            type,
            sourceType: sourceType || 'text',
            content,
            description,
            uploadedBy: (session.user as any).id,
        };

        // Handle web link
        if (sourceType === 'weblink' && webLink) {
            itemData.webLink = webLink;
        }

        // Handle file upload (store base64 data as fileUrl for now)
        if (fileData) {
            itemData.fileUrl = fileData; // In production, upload to cloud storage
            itemData.fileName = fileName;
            itemData.fileSize = fileSize;
        }

        const item = await Corpus.create(itemData);

        return NextResponse.json({ item }, { status: 201 });
    } catch (error) {
        console.error('Create corpus error:', error);
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}
