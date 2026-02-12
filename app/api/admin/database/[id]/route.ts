import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Database from '@/models/Database';

// Update database entry
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { name, description, schema, data, category, isActive } = await req.json();

        await dbConnect();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (schema) updateData.schema = schema;
        if (data) updateData.data = data;
        if (category) updateData.category = category;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;

        const { id } = await params;

        const updatedDatabase = await Database.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedDatabase) {
            return NextResponse.json({ error: 'Database not found' }, { status: 404 });
        }

        return NextResponse.json({ database: updatedDatabase }, { status: 200 });
    } catch (error) {
        console.error('Update database error:', error);
        return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }
}

// Delete database entry
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const database = await Database.findByIdAndDelete(id);

        if (!database) {
            return NextResponse.json({ error: 'Database not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Database deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete database error:', error);
        return NextResponse.json({ error: 'Failed to delete database' }, { status: 500 });
    }
}
