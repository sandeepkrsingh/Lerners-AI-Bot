import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Get all users (admin only)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        const users = await User.find().select('-password').sort({ createdAt: -1 });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error('Get all users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// Bulk update users (for bulk operations)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { userIds, action, value } = await req.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: 'User IDs array is required' }, { status: 400 });
        }

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        await dbConnect();

        let updateData: any = {};

        switch (action) {
            case 'activate':
                updateData = { isActive: true };
                break;
            case 'deactivate':
                updateData = { isActive: false };
                break;
            case 'changeRole':
                if (!value) {
                    return NextResponse.json({ error: 'Role value is required' }, { status: 400 });
                }
                updateData = { role: value };
                break;
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } },
            { $set: updateData }
        );

        return NextResponse.json({
            message: 'Users updated successfully',
            modifiedCount: result.modifiedCount
        }, { status: 200 });
    } catch (error) {
        console.error('Bulk update users error:', error);
        return NextResponse.json(
            { error: 'Failed to update users' },
            { status: 500 }
        );
    }
}
