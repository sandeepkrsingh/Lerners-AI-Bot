"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
}

interface UserManagerProps {
    users: User[];
    onRefresh: () => void;
}

export default function UserManager({ users, onRefresh }: UserManagerProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        isActive: true
    });

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        });
    };

    const handleUpdate = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setEditingUser(null);
                onRefresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update user');
            }
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const handleToggleActive = async (userId: string, isActive: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive })
            });

            if (res.ok) {
                onRefresh();
            }
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                onRefresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete user');
            }
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    return (
        <div className="space-y-3">
            {users.map((user) => (
                <div key={user._id} className="bg-white rounded-xl p-4 shadow-md">
                    {editingUser?._id === user._id ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Name"
                            />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Email"
                            />
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                                <option value="mentor">Mentor</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdate(user._id)}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <p className="text-gray-600 text-sm">{user.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Edit"
                                >
                                    <Icon icon="mdi:pencil" className="text-xl" />
                                </button>
                                <button
                                    onClick={() => handleToggleActive(user._id, user.isActive)}
                                    className={`p-2 rounded-lg ${user.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                                    title={user.isActive ? 'Deactivate' : 'Activate'}
                                >
                                    <Icon icon={user.isActive ? 'mdi:account-off' : 'mdi:account-check'} className="text-xl" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Delete"
                                >
                                    <Icon icon="mdi:delete" className="text-xl" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
