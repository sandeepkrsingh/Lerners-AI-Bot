"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}

interface Chat {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    title: string;
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'chats'>('chats');
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

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
            const [usersRes, chatsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/chats'),
            ]);

            if (usersRes.ok && chatsRes.ok) {
                const usersData = await usersRes.json();
                const chatsData = await chatsRes.json();
                setUsers(usersData.users);
                setChats(chatsData.chats);
            }
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

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <Icon icon="mdi:shield-account" className="text-4xl text-purple-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Admin Panel
                            </span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/chat"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                            >
                                <Icon icon="mdi:chat" />
                                Chat
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Admin Dashboard */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 mb-1">Total Users</p>
                                <h3 className="text-3xl font-bold text-gray-800">{users.length}</h3>
                            </div>
                            <Icon icon="mdi:account-group" className="text-5xl text-primary-600" />
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 mb-1">Total Chats</p>
                                <h3 className="text-3xl font-bold text-gray-800">{chats.length}</h3>
                            </div>
                            <Icon icon="mdi:message-text" className="text-5xl text-purple-600" />
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 mb-1">Total Messages</p>
                                <h3 className="text-3xl font-bold text-gray-800">
                                    {chats.reduce((sum, chat) => sum + chat.messages.length, 0)}
                                </h3>
                            </div>
                            <Icon icon="mdi:chat-processing" className="text-5xl text-secondary-600" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('chats')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'chats'
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Icon icon="mdi:chat" className="inline mr-2" />
                            All Chats
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'users'
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Icon icon="mdi:account-group" className="inline mr-2" />
                            All Users
                        </button>
                    </div>

                    {/* Search Bar */}
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
                                placeholder={`Search ${activeTab}...`}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 max-h-[600px] overflow-y-auto">
                        {activeTab === 'chats' ? (
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
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map((user) => (
                                    <div key={user._id} className="bg-white rounded-xl p-4 shadow-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                                                <p className="text-gray-600 text-sm">{user.email}</p>
                                                <span
                                                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                Joined {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No users found</p>
                                )}
                            </div>
                        )}
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
                            {selectedChat.messages.map((msg, index) => (
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
