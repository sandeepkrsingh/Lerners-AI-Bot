"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';

interface CorpusItem {
    _id: string;
    title: string;
    type: string;
    sourceType: string;
    content: string;
    description?: string;
    fileUrl?: string;
    webLink?: string;
    fileName?: string;
    fileSize?: number;
    isActive: boolean;
}

interface CorpusManagerProps {
    items: CorpusItem[];
    onRefresh: () => void;
}

export default function CorpusManager({ items, onRefresh }: CorpusManagerProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<CorpusItem | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'document',
        sourceType: 'text',
        content: '',
        description: '',
        webLink: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({ title: '', type: 'document', sourceType: 'text', content: '', description: '', webLink: '' });
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleEdit = (item: CorpusItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            type: item.type,
            sourceType: item.sourceType || 'text',
            content: item.content,
            description: item.description || '',
            webLink: item.webLink || ''
        });
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Auto-detect source type from file extension
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (ext === 'pdf') {
                setFormData({ ...formData, sourceType: 'pdf' });
            } else if (ext === 'xlsx' || ext === 'xls') {
                setFormData({ ...formData, sourceType: 'excel' });
            } else if (ext === 'csv') {
                setFormData({ ...formData, sourceType: 'csv' });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let submitData: any = { ...formData };

            // Handle file upload
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const base64 = event.target?.result as string;
                    submitData.fileData = base64;
                    submitData.fileName = selectedFile.name;
                    submitData.fileSize = selectedFile.size;

                    await saveCorpus(submitData);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                await saveCorpus(submitData);
            }
        } catch (error) {
            alert('Failed to save item');
        }
    };

    const saveCorpus = async (data: any) => {
        const url = editingItem ? `/api/admin/corpus/${editingItem._id}` : '/api/admin/corpus';
        const method = editingItem ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            setShowModal(false);
            onRefresh();
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to save item');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;

        try {
            const res = await fetch(`/api/admin/corpus/${id}`, { method: 'DELETE' });
            if (res.ok) onRefresh();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const getSourceIcon = (sourceType: string) => {
        switch (sourceType) {
            case 'pdf': return 'mdi:file-pdf-box';
            case 'excel': return 'mdi:file-excel';
            case 'csv': return 'mdi:file-delimited';
            case 'weblink': return 'mdi:link';
            default: return 'mdi:text-box';
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Corpus Management</h2>
                <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
                    <Icon icon="mdi:plus" />
                    Add Item
                </button>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Icon icon={getSourceIcon(item.sourceType)} className="text-2xl text-blue-600" />
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{item.type}</span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">{item.sourceType}</span>
                                    {item.fileName && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {item.fileName} {item.fileSize && `(${formatFileSize(item.fileSize)})`}
                                        </span>
                                    )}
                                    {item.webLink && (
                                        <a href={item.webLink} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200">
                                            <Icon icon="mdi:open-in-new" className="inline" /> Link
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Icon icon="mdi:pencil" className="text-xl" />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Icon icon="mdi:delete" className="text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Edit' : 'Create'} Corpus Item</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Title"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="document">Document</option>
                                            <option value="policy">Policy</option>
                                            <option value="syllabus">Syllabus</option>
                                            <option value="faq">FAQ</option>
                                            <option value="manual">Manual</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Source Type</label>
                                        <select
                                            value={formData.sourceType}
                                            onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="text">Text</option>
                                            <option value="pdf">PDF</option>
                                            <option value="excel">Excel</option>
                                            <option value="csv">CSV</option>
                                            <option value="weblink">Web Link</option>
                                        </select>
                                    </div>
                                </div>

                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Description"
                                    rows={2}
                                />

                                {formData.sourceType === 'weblink' ? (
                                    <input
                                        type="url"
                                        value={formData.webLink}
                                        onChange={(e) => setFormData({ ...formData, webLink: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="https://example.com"
                                        required
                                    />
                                ) : formData.sourceType !== 'text' ? (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Upload File</label>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept={
                                                formData.sourceType === 'pdf' ? '.pdf' :
                                                    formData.sourceType === 'excel' ? '.xlsx,.xls' :
                                                        formData.sourceType === 'csv' ? '.csv' : '*'
                                            }
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                        {selectedFile && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                            </p>
                                        )}
                                    </div>
                                ) : null}

                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder={formData.sourceType === 'text' ? 'Content' : 'Content (auto-extracted from file or enter manually)'}
                                    rows={6}
                                    required
                                />
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
