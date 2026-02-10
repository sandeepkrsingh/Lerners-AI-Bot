"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface Chat {
    _id: string;
    title: string;
    messages: Message[];
    updatedAt: Date;
}

export default function ChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated' && !currentChat) {
            createNewChat();
        }
    }, [status]);

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const createNewChat = async () => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentChat(data.chat);
            }
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currentChat || loading) return;

        const userMessage = message;
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(`/api/chat/${currentChat._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentChat(data.chat);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
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
                        <Link href="/" className="flex items-center space-x-3">
                            <Image src="/dpu-logo.svg" alt="DPU Logo" width={180} height={54} className="h-10 w-auto" />
                        </Link>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Hi, {session?.user?.name}</span>
                            {(session?.user as any)?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                >
                                    <Icon icon="mdi:shield-account" />
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Icon icon="mdi:logout" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Chat Container */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="glass rounded-2xl shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Messages Area */}
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {!currentChat?.messages || currentChat.messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <Icon icon="mdi:chat-question" className="text-8xl text-gray-300 mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Start a Conversation</h2>
                                    <p className="text-gray-500">Ask me anything and I'll help you learn!</p>
                                </div>
                            ) : (
                                <>
                                    {currentChat.messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                                                    : 'bg-white text-gray-800 shadow-md'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    {msg.role === 'assistant' && (
                                                        <Icon icon="mdi:robot" className="text-2xl text-primary-600 mt-1" />
                                                    )}
                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                                                <Icon icon="mdi:dots-horizontal" className="text-2xl text-gray-400 animate-pulse" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 p-4 bg-white bg-opacity-50">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your question here..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Icon icon="mdi:send" className="text-xl" />
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
