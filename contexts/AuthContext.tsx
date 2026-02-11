"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signup: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);

            if (firebaseUser) {
                // Sync Firebase user with MongoDB (non-blocking)
                // This happens in the background and doesn't block authentication
                fetch('/api/auth/sync-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName
                    })
                })
                    .then(async (response) => {
                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error('Failed to sync user with MongoDB');
                            console.error('Status:', response.status);
                            console.error('Error details:', errorData);
                        } else {
                            const data = await response.json();
                            console.log('User synced successfully:', data.user);
                        }
                    })
                    .catch((error) => {
                        console.error('Error syncing user:', error);
                    });
            }
        });

        return unsubscribe;
    }, []);

    const signup = async (email: string, password: string, name: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user in MongoDB
        await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: name
            })
        });
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
