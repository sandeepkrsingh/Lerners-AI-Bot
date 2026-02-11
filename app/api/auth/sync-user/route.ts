import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        const { uid, email, name } = await req.json();

        console.log('Sync user request:', { uid, email, name });

        if (!uid || !email) {
            console.error('Missing required fields:', { uid, email });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        console.log('Database connected');

        // Check if user exists
        let user = await User.findOne({ firebaseUid: uid });
        console.log('Existing user:', user ? 'Found' : 'Not found');

        if (!user) {
            // Create new user in MongoDB
            console.log('Creating new user...');
            user = await User.create({
                firebaseUid: uid,
                email,
                name: name || email.split('@')[0],
                role: 'student', // Default role
                isActive: true
            });
            console.log('User created:', user._id);
        } else {
            // Update existing user
            console.log('Updating existing user...');
            user.email = email;
            if (name) user.name = name;
            await user.save();
            console.log('User updated');
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        console.error('Sync user error:', error);
        console.error('Error details:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to sync user', details: error.message }, { status: 500 });
    }
}
