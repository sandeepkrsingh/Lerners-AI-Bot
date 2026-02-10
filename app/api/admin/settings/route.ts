import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

// Get current settings
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Get or create default settings
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({
                logo: '/dpu-logo.svg',
                primaryColor: '#3b82f6',
                secondaryColor: '#ec4899',
                accentColor: '#8b5cf6',
                theme: 'light',
                appName: 'DPU Centre for Online Learning',
            });
        }

        return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
        console.error('Get settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// Update settings (admin only)
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { logo, primaryColor, secondaryColor, accentColor, theme, appName } = await req.json();

        await dbConnect();

        // Find existing settings or create new
        let settings = await Settings.findOne();

        const updateData: any = {
            updatedBy: (session.user as any).id,
        };

        if (logo !== undefined) updateData.logo = logo;
        if (primaryColor) updateData.primaryColor = primaryColor;
        if (secondaryColor) updateData.secondaryColor = secondaryColor;
        if (accentColor) updateData.accentColor = accentColor;
        if (theme) updateData.theme = theme;
        if (appName) updateData.appName = appName;

        if (settings) {
            // Update existing
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        } else {
            // Create new
            settings = await Settings.create({
                ...updateData,
                logo: logo || '/dpu-logo.png',
                primaryColor: primaryColor || '#3b82f6',
                secondaryColor: secondaryColor || '#ec4899',
                accentColor: accentColor || '#8b5cf6',
                theme: theme || 'light',
                appName: appName || 'DPU Centre for Online Learning',
            });
        }

        return NextResponse.json({ settings }, { status: 200 });
    } catch (error: any) {
        console.error('Update settings error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to update settings'
        }, { status: 500 });
    }
}
