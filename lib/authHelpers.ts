import { auth } from './firebase';

/**
 * Get Firebase ID token for authenticated requests
 */
export async function getIdToken(): Promise<string | null> {
    try {
        const user = auth.currentUser;
        if (!user) return null;

        const token = await user.getIdToken();
        return token;
    } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
    }
}

/**
 * Get auth headers for API requests
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
    const user = auth.currentUser;

    if (!user) {
        return {};
    }

    // Send Firebase UID in header (simpler approach for development)
    return {
        'X-Firebase-UID': user.uid,
        'Content-Type': 'application/json'
    };
}
