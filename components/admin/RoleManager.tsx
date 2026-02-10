"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

interface Role {
    _id: string;
    name: string;
    description?: string;
    permissions: any;
    isSystem: boolean;
}

interface RoleManagerProps {
    roles: Role[];
    onRefresh: () => void;
}

export default function RoleManager({ roles, onRefresh }: RoleManagerProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: {
            manageUsers: false,
            manageRoles: false,
            manageCorpus: false,
            manageDatabase: false,
            manageAIRules: false,
            viewAllChats: false,
            deleteChats: false,
            viewAnalytics: false,
        }
    });

    const handleCreate = () => {
        setEditingRole(null);
        setFormData({
            name: '',
            description: '',
            permissions: {
                manageUsers: false,
                manageRoles: false,
                manageCorpus: false,
                manageDatabase: false,
                manageAIRules: false,
                viewAllChats: false,
                deleteChats: false,
                viewAnalytics: false,
            }
        });
        setShowModal(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description || '',
            permissions: role.permissions
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingRole
                ? `/api/admin/roles/${editingRole._id}`
                : '/api/admin/roles';

            const method = editingRole ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                onRefresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save role');
            }
        } catch (error) {
            console.error('Save role error:', error);
            alert('Failed to save role');
        }
    };

    const handleDelete = async (roleId: string) => {
        if (!confirm('Are you sure you want to delete this role?')) return;

        try {
            const res = await fetch(`/api/admin/roles/${roleId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                onRefresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete role');
            }
        } catch (error) {
            console.error('Delete role error:', error);
            alert('Failed to delete role');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Role Management</h2>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                    <Icon icon="mdi:plus" />
                    Create Role
                </button>
            </div>

            <div className="space-y-3">
                {roles.map((role) => (
                    <div key={role._id} className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{role.name}</h3>
                                    {role.isSystem && (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                            System
                                        </span>
                                    )}
                                </div>
                                {role.description && (
                                    <p className="text-gray-600 text-sm mt-1">{role.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.entries(role.permissions).map(([key, value]) =>
                                        value && (
                                            <span key={key} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                                {key}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(role)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <Icon icon="mdi:pencil" className="text-xl" />
                                </button>
                                {!role.isSystem && (
                                    <button
                                        onClick={() => handleDelete(role._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Icon icon="mdi:delete" className="text-xl" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingRole ? 'Edit Role' : 'Create Role'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                        disabled={editingRole?.isSystem}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows={2}
                                        disabled={editingRole?.isSystem}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Permissions</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.keys(formData.permissions).map((key) => (
                                            <label key={key} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions[key as keyof typeof formData.permissions]}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        permissions: {
                                                            ...formData.permissions,
                                                            [key]: e.target.checked
                                                        }
                                                    })}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">{key}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    {editingRole ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
