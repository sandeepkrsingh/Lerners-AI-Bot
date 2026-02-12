import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * ADMIN SETUP ENDPOINT
 * This endpoint allows you to make a user an admin
 * For security, this should be disabled in production or protected with a secret key
 */
export async function POST(req: NextRequest) {
    try {
        // Security: Require secret key to prevent unauthorized admin creation
        const secretKey = req.headers.get('x-admin-secret');
        if (secretKey !== process.env.ADMIN_SETUP_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user to admin with full permissions
        user.role = 'admin';
        user.permissions = {
            manageUsers: true,
            manageCorpus: true,
            manageDB: true,
            viewChats: true,
        };
        user.isActive = true;

        await user.save();

        return NextResponse.json({
            success: true,
            message: 'User updated to admin successfully',
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: user.permissions,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Make admin error:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
