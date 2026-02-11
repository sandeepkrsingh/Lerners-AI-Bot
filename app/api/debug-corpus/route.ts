import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Corpus from '@/models/Corpus';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const items = await Corpus.find({ isActive: true });

        const details = items.map(item => ({
            title: item.title,
            type: item.type,
            sourceType: item.sourceType,
            fileName: item.fileName,
            fileSize: item.fileSize,
            contentLength: item.content?.length || 0,
            hasContent: !!item.content && item.content.length > 0,
            contentStart: item.content?.substring(0, 500) || 'NO CONTENT'
        }));

        return NextResponse.json({
            count: items.length,
            details
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
