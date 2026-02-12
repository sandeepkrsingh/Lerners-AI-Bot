import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import AIRule from '@/models/AIRule';

// Update AI rule
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { rule, category, priority, isActive } = await req.json();

        await dbConnect();

        await dbConnect();

        const { id } = await params;

        const updatedRule = await AIRule.findByIdAndUpdate(
            id,
            {
                ...(rule && { rule }),
                ...(category && { category }),
                ...(priority && { priority }),
                ...(typeof isActive === 'boolean' && { isActive }),
            },
            { new: true }
        );

        if (!updatedRule) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        return NextResponse.json({ rule: updatedRule }, { status: 200 });
    } catch (error) {
        console.error('Update rule error:', error);
        return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
    }
}

// Delete AI rule
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
        const deletedRule = await AIRule.findByIdAndDelete(id);

        if (!deletedRule) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Rule deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete rule error:', error);
        return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
    }
}
