import { IUser } from '@/models/User';

/**
 * Role-Based Access Control (RBAC) Helper Functions
 * Defines permissions and access control for different user roles
 */

// Role definitions with default permissions
export const ROLE_PERMISSIONS = {
    admin: {
        manageUsers: true,
        manageCorpus: true,
        manageDB: true,
        viewChats: true, // Can view all chats
    },
    student: {
        manageUsers: false,
        manageCorpus: false,
        manageDB: false,
        viewChats: false, // Can only view own chats
    },
    faculty: {
        manageUsers: false,
        manageCorpus: false, // Can be granted by admin
        manageDB: false,
        viewChats: false,
    },
    mentor: {
        manageUsers: false,
        manageCorpus: false,
        manageDB: false,
        viewChats: false,
    },
} as const;

export type Permission = keyof typeof ROLE_PERMISSIONS.admin;
export type Role = 'admin' | 'student' | 'faculty' | 'mentor';

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: IUser | null | undefined, permission: Permission): boolean {
    if (!user || !user.role) return false;

    // Admin always has all permissions
    if (user.role === 'admin') return true;

    // Check custom permissions first (for faculty with granted upload permission)
    if (user.permissions && permission in user.permissions) {
        return user.permissions[permission];
    }

    // Fall back to role-based permissions
    const rolePerms = ROLE_PERMISSIONS[user.role as Role];
    return rolePerms ? rolePerms[permission] : false;
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdmin(user: IUser | null | undefined): boolean {
    return user?.role === 'admin';
}

/**
 * Check if user can view a specific chat
 * @param user - The user trying to view the chat
 * @param chatUserId - The ID of the user who owns the chat
 */
export function canViewChat(user: IUser | null | undefined, chatUserId: string): boolean {
    if (!user) return false;

    // Admin can view all chats
    if (hasPermission(user, 'viewChats')) return true;

    // Users can view their own chats
    return user._id.toString() === chatUserId.toString();
}

/**
 * Check if user can upload/manage corpus
 */
export function canManageCorpus(user: IUser | null | undefined): boolean {
    return hasPermission(user, 'manageCorpus');
}

/**
 * Check if user can manage database
 */
export function canManageDatabase(user: IUser | null | undefined): boolean {
    return hasPermission(user, 'manageDB');
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(user: IUser | null | undefined): boolean {
    return hasPermission(user, 'manageUsers');
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role) {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.student;
}

/**
 * Get user-friendly role name
 */
export function getRoleName(role: Role): string {
    const roleNames = {
        admin: 'Administrator',
        student: 'Student',
        faculty: 'Faculty',
        mentor: 'Mentor',
    };
    return roleNames[role] || 'Student';
}

/**
 * Get role description
 */
export function getRoleDescription(role: Role): string {
    const descriptions = {
        admin: 'Full system access with all privileges',
        student: 'Access to learning materials and corpus',
        faculty: 'Academic queries and teaching support',
        mentor: 'Student guidance and advisory support',
    };
    return descriptions[role] || '';
}

/**
 * Initialize default permissions for a role
 */
export function getDefaultPermissions(role: Role) {
    const defaults = ROLE_PERMISSIONS[role];
    return {
        manageUsers: defaults.manageUsers,
        manageCorpus: defaults.manageCorpus,
        manageDB: defaults.manageDB,
        viewChats: defaults.viewChats,
    };
}

/**
 * Get role badge color for UI
 */
export function getRoleBadgeColor(role: Role): string {
    const colors = {
        admin: 'bg-red-100 text-red-800',
        student: 'bg-blue-100 text-blue-800',
        faculty: 'bg-purple-100 text-purple-800',
        mentor: 'bg-green-100 text-green-800',
    };
    return colors[role] || colors.student;
}
