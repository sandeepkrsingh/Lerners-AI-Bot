import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Role from '@/models/Role';

// Update role
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { name, description, permissions } = await req.json();

        await dbConnect();

        // Check if role is a system role
        const role = await Role.findById(params.id);
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        if (role.isSystem) {
            // Only allow updating permissions for system roles, not name or description
            const updatedRole = await Role.findByIdAndUpdate(
                params.id,
                { permissions },
                { new: true }
            );
            return NextResponse.json({ role: updatedRole }, { status: 200 });
        }

        // For custom roles, allow full updates
        const updatedRole = await Role.findByIdAndUpdate(
            params.id,
            {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(permissions && { permissions }),
            },
            { new: true }
        );

        return NextResponse.json({ role: updatedRole }, { status: 200 });
    } catch (error) {
        console.error('Update role error:', error);
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}

// Delete role
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

        const role = await Role.findById(params.id);
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        // Prevent deletion of system roles
        if (role.isSystem) {
            return NextResponse.json(
                { error: 'Cannot delete system roles' },
                { status: 400 }
            );
        }

        await Role.findByIdAndDelete(params.id);

        return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete role error:', error);
        return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
    }
}
