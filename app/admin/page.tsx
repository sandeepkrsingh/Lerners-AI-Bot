"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import RoleManager from '@/components/admin/RoleManager';
import UserManager from '@/components/admin/UserManager';
import CorpusManager from '@/components/admin/CorpusManager';
import DatabaseManager from '@/components/admin/DatabaseManager';
import AIRulesManager from '@/components/admin/AIRulesManager';
import SettingsManager from '@/components/admin/SettingsManager';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'chats' | 'users' | 'roles' | 'corpus' | 'database' | 'rules' | 'settings'>('chats');
    const [searchTerm, setSearchTerm] = useState('');

    // Data states
    const [users, setUsers] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [corpus, setCorpus] = useState<any[]>([]);
    const [databases, setDatabases] = useState<any[]>([]);
    const [rules, setRules] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
            router.push('/chat');
        } else if (status === 'authenticated') {
            fetchData();
        }
    }, [status, session, router]);

    const fetchData = async () => {
        try {
            const [usersRes, chatsRes, rolesRes, corpusRes, dbRes, rulesRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/chats'),
                fetch('/api/admin/roles'),
                fetch('/api/admin/corpus'),
                fetch('/api/admin/database'),
                fetch('/api/admin/rules'),
            ]);

            if (usersRes.ok) setUsers((await usersRes.json()).users);
            if (chatsRes.ok) setChats((await chatsRes.json()).chats);
            if (rolesRes.ok) setRoles((await rolesRes.json()).roles);
            if (corpusRes.ok) setCorpus((await corpusRes.json()).items);
            if (dbRes.ok) setDatabases((await dbRes.json()).databases);
            if (rulesRes.ok) setRules((await rulesRes.json()).rules);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredChats = chats.filter(
        (chat) =>
            chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <Icon icon="mdi:loading" className="text-6xl text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <nav className="glass sticky top-0 z-50 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image src="/dpu-logo.svg" alt="DPU Logo" width={180} height={54} className="h-10 w-auto" />
                            <span className="text-lg font-semibold text-gray-700">Admin Panel</span>
                        </Link>
                        <Link
                            href="/chat"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                        >
                            <Icon icon="mdi:chat" />
                            Chat
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Users</p>
                                <h3 className="text-2xl font-bold text-gray-800">{users.length}</h3>
                            </div>
                            <Icon icon="mdi:account-group" className="text-4xl text-primary-600" />
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Chats</p>
                                <h3 className="text-2xl font-bold text-gray-800">{chats.length}</h3>
                            </div>
                            <Icon icon="mdi:message-text" className="text-4xl text-purple-600" />
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Corpus</p>
                                <h3 className="text-2xl font-bold text-gray-800">{corpus.length}</h3>
                            </div>
                            <Icon icon="mdi:file-document" className="text-4xl text-secondary-600" />
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">AI Rules</p>
                                <h3 className="text-2xl font-bold text-gray-800">{rules.length}</h3>
                            </div>
                            <Icon icon="mdi:robot" className="text-4xl text-pink-600" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {[
                            { id: 'chats', icon: 'mdi:chat', label: 'Chats' },
                            { id: 'users', icon: 'mdi:account-group', label: 'Users' },
                            { id: 'roles', icon: 'mdi:shield-account', label: 'Roles' },
                            { id: 'corpus', icon: 'mdi:file-document', label: 'Corpus' },
                            { id: 'database', icon: 'mdi:database', label: 'Database' },
                            { id: 'rules', icon: 'mdi:robot', label: 'AI Rules' },
                            { id: 'settings', icon: 'mdi:cog', label: 'Settings' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 px-4 py-3 font-semibold transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon icon={tab.icon} className="inline mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar (only for chats) */}
                    {activeTab === 'chats' && (
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Icon
                                    icon="mdi:magnify"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search chats..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-4 max-h-[600px] overflow-y-auto">
                        {activeTab === 'chats' && (
                            <div className="space-y-4">
                                {filteredChats.map((chat) => (
                                    <div
                                        key={chat._id}
                                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                        onClick={() => setSelectedChat(chat)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg text-gray-800">{chat.title}</h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(chat.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <Icon icon="mdi:account" className="inline mr-1" />
                                            {chat.userId?.name || 'Unknown User'} ({chat.userId?.email || 'N/A'})
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            <Icon icon="mdi:message-text" className="inline mr-1" />
                                            {chat.messages.length} messages
                                        </p>
                                    </div>
                                ))}
                                {filteredChats.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No chats found</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'users' && <UserManager users={users} onRefresh={fetchData} />}
                        {activeTab === 'roles' && <RoleManager roles={roles} onRefresh={fetchData} />}
                        {activeTab === 'corpus' && <CorpusManager items={corpus} onRefresh={fetchData} />}
                        {activeTab === 'database' && <DatabaseManager databases={databases} onRefresh={fetchData} />}
                        {activeTab === 'rules' && <AIRulesManager rules={rules} onRefresh={fetchData} />}
                        {activeTab === 'settings' && <SettingsManager onRefresh={fetchData} />}
                    </div>
                </div>
            </div>

            {/* Chat Modal */}
            {selectedChat && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedChat(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedChat.title}</h2>
                                    <p className="text-sm opacity-90">
                                        User: {selectedChat.userId?.name} ({selectedChat.userId?.email})
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedChat(null)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                                >
                                    <Icon icon="mdi:close" className="text-2xl" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                            {selectedChat.messages.map((msg: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <p className="text-sm opacity-70 mb-1">
                                            {msg.role === 'user' ? 'User' : 'Assistant'}
                                        </p>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
