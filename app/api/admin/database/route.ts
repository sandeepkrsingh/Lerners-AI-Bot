import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Database from '@/models/Database';

// Get all database entries
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const databases = await Database.find().sort({ createdAt: -1 });
        return NextResponse.json({ databases }, { status: 200 });
    } catch (error) {
        console.error('Get databases error:', error);
        return NextResponse.json({ error: 'Failed to fetch databases' }, { status: 500 });
    }
}

// Create new database entry
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { name, description, schema, data, category } = await req.json();

        if (!name || !schema) {
            return NextResponse.json(
                { error: 'Name and schema are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const database = await Database.create({
            name,
            description,
            schema,
            data: data || [],
            category: category || 'other',
            uploadedBy: (session.user as any).id,
        });

        return NextResponse.json({ database }, { status: 201 });
    } catch (error) {
        console.error('Create database error:', error);
        return NextResponse.json({ error: 'Failed to create database' }, { status: 500 });
    }
}
