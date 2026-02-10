import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Role from '@/models/Role';

// Get all roles
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const roles = await Role.find().sort({ isSystem: -1, createdAt: -1 });
        return NextResponse.json({ roles }, { status: 200 });
    } catch (error) {
        console.error('Get roles error:', error);
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
}

// Create new role
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { name, description, permissions } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
        }

        await dbConnect();

        // Check if role name already exists
        const existingRole = await Role.findOne({ name: name.toLowerCase() });
        if (existingRole) {
            return NextResponse.json({ error: 'Role name already exists' }, { status: 400 });
        }

        const newRole = await Role.create({
            name,
            description,
            permissions: permissions || {},
            isSystem: false,
            createdBy: (session.user as any).id,
        });

        return NextResponse.json({ role: newRole }, { status: 201 });
    } catch (error) {
        console.error('Create role error:', error);
        return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
    }
}
