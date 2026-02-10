"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

interface AIRule {
    _id: string;
    rule: string;
    category: string;
    priority: string;
    isActive: boolean;
}

interface AIRulesManagerProps {
    rules: AIRule[];
    onRefresh: () => void;
}

export default function AIRulesManager({ rules, onRefresh }: AIRulesManagerProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState<AIRule | null>(null);
    const [formData, setFormData] = useState({
        rule: '',
        category: 'behavior',
        priority: 'medium'
    });

    const handleCreate = () => {
        setEditingRule(null);
        setFormData({ rule: '', category: 'behavior', priority: 'medium' });
        setShowModal(true);
    };

    const handleEdit = (rule: AIRule) => {
        setEditingRule(rule);
        setFormData({ rule: rule.rule, category: rule.category, priority: rule.priority });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingRule ? `/api/admin/rules/${editingRule._id}` : '/api/admin/rules';
            const method = editingRule ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                onRefresh();
            }
        } catch (error) {
            alert('Failed to save rule');
        }
    };

    const handleToggleActive = async (ruleId: string, isActive: boolean) => {
        try {
            await fetch(`/api/admin/rules/${ruleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive })
            });
            onRefresh();
        } catch (error) {
            alert('Failed to update rule');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this rule?')) return;

        try {
            const res = await fetch(`/api/admin/rules/${id}`, { method: 'DELETE' });
            if (res.ok) onRefresh();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AI Rules Management</h2>
                <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
                    <Icon icon="mdi:plus" />
                    Add Rule
                </button>
            </div>

            <div className="space-y-3">
                {rules.map((rule) => (
                    <div key={rule._id} className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-gray-800">{rule.rule}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{rule.category}</span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">{rule.priority}</span>
                                    <span className={`px-2 py-1 text-xs rounded ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {rule.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleToggleActive(rule._id, rule.isActive)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg">
                                    <Icon icon={rule.isActive ? 'mdi:eye-off' : 'mdi:eye'} className="text-xl" />
                                </button>
                                <button onClick={() => handleEdit(rule)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Icon icon="mdi:pencil" className="text-xl" />
                                </button>
                                <button onClick={() => handleDelete(rule._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Icon icon="mdi:delete" className="text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">{editingRule ? 'Edit' : 'Create'} AI Rule</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <textarea value={formData.rule} onChange={(e) => setFormData({ ...formData, rule: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Rule description" rows={4} required />
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="behavior">Behavior</option>
                                    <option value="safety">Safety</option>
                                    <option value="response_style">Response Style</option>
                                    <option value="domain_boundary">Domain Boundary</option>
                                </select>
                                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
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
