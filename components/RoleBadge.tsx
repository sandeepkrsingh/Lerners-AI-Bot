import { Icon } from '@iconify/react';
import { Role, getRoleName, getRoleBadgeColor } from '@/lib/rbac';

interface RoleBadgeProps {
    role: Role;
    className?: string;
}

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
    const roleName = getRoleName(role);
    const badgeColor = getRoleBadgeColor(role);

    const icons = {
        admin: 'mdi:shield-crown',
        student: 'mdi:school',
        faculty: 'mdi:account-tie',
        mentor: 'mdi:account-supervisor',
    };

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor} ${className}`}>
            <Icon icon={icons[role]} className="w-3.5 h-3.5" />
            <span>{roleName}</span>
        </div>
    );
}
