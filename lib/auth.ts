
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email }).select('+password');

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                if (!user.isActive) {
                    throw new Error('Your account has been deactivated. Please contact an admin.');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    permissions: user.permissions,
                    isActive: user.isActive,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                await dbConnect();
                try {
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create new user for Google login
                        const newUser = await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            provider: 'google',
                            role: 'student', // Default role
                            isActive: true,
                            permissions: {} // Default permissions
                        });
                        user.id = newUser._id.toString();
                        (user as any).role = newUser.role;
                        (user as any).permissions = newUser.permissions;
                        (user as any).isActive = newUser.isActive;
                    } else {
                        // Update existing user logic if needed, or just set user properties
                        user.id = existingUser._id.toString();
                        (user as any).role = existingUser.role;
                        (user as any).permissions = existingUser.permissions;
                        (user as any).isActive = existingUser.isActive;
                    }
                    return true;
                } catch (error) {
                    console.error('Error in Google Sign In:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.permissions = user.permissions;
                token.isActive = user.isActive;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).permissions = token.permissions;
                (session.user as any).isActive = token.isActive;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
