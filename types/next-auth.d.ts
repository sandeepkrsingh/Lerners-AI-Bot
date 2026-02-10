import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            permissions: {
                manageUsers: boolean;
                manageCorpus: boolean;
                manageDB: boolean;
                viewChats: boolean;
            };
            isActive: boolean;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        role: string;
        permissions: {
            manageUsers: boolean;
            manageCorpus: boolean;
            manageDB: boolean;
            viewChats: boolean;
        };
        isActive: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        permissions: {
            manageUsers: boolean;
            manageCorpus: boolean;
            manageDB: boolean;
            viewChats: boolean;
        };
        isActive: boolean;
    }
}
