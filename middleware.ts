import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname;

            // Admin routes require admin role
            if (path.startsWith('/admin')) {
                return token?.role === 'admin';
            }

            // Protected routes require authentication
            if (path.startsWith('/chat')) {
                return !!token;
            }

            return true;
        },
    },
});

export const config = {
    matcher: ['/chat/:path*', '/admin/:path*'],
};
