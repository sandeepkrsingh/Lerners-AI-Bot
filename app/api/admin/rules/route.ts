import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import AIRule from '@/models/AIRule';

// Get all AI rules
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const rules = await AIRule.find().sort({ priority: 1, createdAt: -1 });
        return NextResponse.json({ rules }, { status: 200 });
    } catch (error) {
        console.error('Get rules error:', error);
        return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
    }
}

// Create new AI rule
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { rule, category, priority } = await req.json();

        if (!rule) {
            return NextResponse.json({ error: 'Rule content is required' }, { status: 400 });
        }

        await dbConnect();

        const newRule = await AIRule.create({
            rule,
            category: category || 'behavior',
            priority: priority || 'medium',
            createdBy: (session.user as any).id,
        });

        return NextResponse.json({ rule: newRule }, { status: 201 });
    } catch (error) {
        console.error('Create rule error:', error);
        return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
    }
}
