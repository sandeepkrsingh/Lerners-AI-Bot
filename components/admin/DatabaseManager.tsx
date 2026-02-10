"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

interface DatabaseEntry {
    _id: string;
    name: string;
    description?: string;
    category: string;
    schema: any;
    data: any[];
    isActive: boolean;
}

interface DatabaseManagerProps {
    databases: DatabaseEntry[];
    onRefresh: () => void;
}

export default function DatabaseManager({ databases, onRefresh }: DatabaseManagerProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingDb, setEditingDb] = useState<DatabaseEntry | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'other',
        schema: '{}',
        data: '[]'
    });

    const handleCreate = () => {
        setEditingDb(null);
        setFormData({ name: '', description: '', category: 'other', schema: '{}', data: '[]' });
        setShowModal(true);
    };

    const handleEdit = (db: DatabaseEntry) => {
        setEditingDb(db);
        setFormData({
            name: db.name,
            description: db.description || '',
            category: db.category,
            schema: JSON.stringify(db.schema, null, 2),
            data: JSON.stringify(db.data, null, 2)
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const schema = JSON.parse(formData.schema);
            const data = JSON.parse(formData.data);

            const url = editingDb ? `/api/admin/database/${editingDb._id}` : '/api/admin/database';
            const method = editingDb ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    schema,
                    data
                })
            });

            if (res.ok) {
                setShowModal(false);
                onRefresh();
            }
        } catch (error) {
            alert('Invalid JSON format');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this database?')) return;

        try {
            const res = await fetch(`/api/admin/database/${id}`, { method: 'DELETE' });
            if (res.ok) onRefresh();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Database Management</h2>
                <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
                    <Icon icon="mdi:plus" />
                    Add Database
                </button>
            </div>

            <div className="space-y-3">
                {databases.map((db) => (
                    <div key={db._id} className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{db.name}</h3>
                                <p className="text-sm text-gray-600">{db.description}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{db.category}</span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">{db.data.length} records</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(db)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Icon icon="mdi:pencil" className="text-xl" />
                                </button>
                                <button onClick={() => handleDelete(db._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Icon icon="mdi:delete" className="text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-4">{editingDb ? 'Edit' : 'Create'} Database</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Name" required />
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Description" rows={2} />
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="learner_records">Learner Records</option>
                                    <option value="academic_data">Academic Data</option>
                                    <option value="logs">Logs</option>
                                    <option value="other">Other</option>
                                </select>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Schema (JSON)</label>
                                    <textarea value={formData.schema} onChange={(e) => setFormData({ ...formData, schema: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" rows={4} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Data (JSON Array)</label>
                                    <textarea value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" rows={6} required />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
