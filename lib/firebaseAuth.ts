import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User, { IUser } from '@/models/User';
import { Role, Permission, hasPermission } from '@/lib/rbac';

/**
 * Get Firebase user from request headers
 * This is a simplified version that gets the user from MongoDB using the Firebase UID
 * In production, you should verify the Firebase ID token
 */
export async function getFirebaseUser(req: NextRequest) {
    try {
        // Get the Firebase UID from the Authorization header
        // The client should send: Authorization: Bearer <firebase-id-token>
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const idToken = authHeader.split('Bearer ')[1];

        // NOTE: This implementation uses basic JWT decoding for development purposes.
        // For production deployment, implement proper Firebase ID token verification
        // using Firebase Admin SDK. See: https://firebase.google.com/docs/auth/admin/verify-id-tokens
        // Install: npm install firebase-admin
        // Then use: admin.auth().verifyIdToken(idToken)

        // Temporary: Extract UID from token payload (base64 decode)
        // This is NOT secure and should be replaced with proper verification
        try {
            const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
            const firebaseUid = payload.user_id || payload.sub;

            if (!firebaseUid) {
                return null;
            }

            await dbConnect();
            const user = await User.findOne({ firebaseUid });

            return user;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    } catch (error) {
        console.error('Error getting Firebase user:', error);
        return null;
    }
}

/**
 * Alternative: Get user from custom header (simpler for development)
 * Client sends X-Firebase-UID header with the Firebase UID
 */
export async function getFirebaseUserSimple(req: NextRequest) {
    try {
        const firebaseUid = req.headers.get('x-firebase-uid');

        if (!firebaseUid) {
            return null;
        }

        await dbConnect();
        const user = await User.findOne({ firebaseUid });

        return user;
    } catch (error) {
        console.error('Error getting Firebase user:', error);
        return null;
    }
}

/**
 * Require specific role(s) for API access
 * Returns user if authorized, or NextResponse with error if not
 */
export async function requireRole(req: NextRequest, allowedRoles: Role | Role[]): Promise<IUser | NextResponse> {
    const user = await getFirebaseUserSimple(req);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role as Role)) {
        return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
    }

    return user;
}

/**
 * Require specific permission for API access
 * Returns user if authorized, or NextResponse with error if not
 */
export async function requirePermission(req: NextRequest, permission: Permission): Promise<IUser | NextResponse> {
    const user = await getFirebaseUserSimple(req);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, permission)) {
        return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
    }

    return user;
}

/**
 * Require admin role for API access
 * Convenience function for admin-only routes
 */
export async function requireAdmin(req: NextRequest): Promise<IUser | NextResponse> {
    return requireRole(req, 'admin');
}
