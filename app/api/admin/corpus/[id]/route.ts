import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Corpus from '@/models/Corpus';

// Update corpus item
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { title, type, sourceType, content, description, isActive, webLink, fileData, fileName, fileSize } = await req.json();

        await dbConnect();

        const updateData: any = {};
        if (title) updateData.title = title;
        if (type) updateData.type = type;
        if (sourceType) updateData.sourceType = sourceType;
        if (content) updateData.content = content;
        if (description !== undefined) updateData.description = description;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        if (webLink !== undefined) updateData.webLink = webLink;
        if (fileData) {
            updateData.fileUrl = fileData;
            updateData.fileName = fileName;
            updateData.fileSize = fileSize;
        }

        const updatedItem = await Corpus.findByIdAndUpdate(
            params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ item: updatedItem }, { status: 200 });
    } catch (error) {
        console.error('Update corpus error:', error);
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}

// Delete corpus item
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const item = await Corpus.findByIdAndDelete(params.id);

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete corpus error:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
