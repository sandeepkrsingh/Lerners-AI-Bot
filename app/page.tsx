"use client";

import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:robot-happy" className="text-4xl text-primary-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                Learner Bot
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent animate-gradient">
                        Your AI Learning Assistant
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Get instant help with your studies. Ask questions, learn concepts, and enhance your knowledge with our intelligent chatbot.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/signup"
                            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            Start Learning Now
                            <Icon icon="mdi:arrow-right" className="inline ml-2" />
                        </Link>
                        <Link
                            href="/chat"
                            className="px-8 py-4 glass-dark text-gray-700 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300"
                        >
                            Try Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Why Choose Learner Bot?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="glass p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-4">
                            <Icon icon="mdi:brain" className="text-4xl text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Smart AI Assistant</h3>
                        <p className="text-gray-600">
                            Get intelligent responses to your questions with our advanced AI that understands context and provides detailed explanations.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                            <Icon icon="mdi:history" className="text-4xl text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Chat History</h3>
                        <p className="text-gray-600">
                            All your conversations are saved automatically. Review past discussions and continue learning from where you left off.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-xl flex items-center justify-center mb-4">
                            <Icon icon="mdi:shield-check" className="text-4xl text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Secure & Private</h3>
                        <p className="text-gray-600">
                            Your data is encrypted and secure. We prioritize your privacy and ensure your learning journey stays confidential.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl my-20">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                            1
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Sign Up</h3>
                        <p className="text-gray-600">Create your free account in seconds</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                            2
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Ask Questions</h3>
                        <p className="text-gray-600">Start chatting with the AI assistant</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                            3
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Learn & Grow</h3>
                        <p className="text-gray-600">Get detailed explanations and insights</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                            4
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                        <p className="text-gray-600">Review your chat history anytime</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="glass-dark p-12 rounded-3xl">
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">
                        Ready to Accelerate Your Learning?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of learners who are already using our AI assistant
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        Get Started for Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Icon icon="mdi:robot-happy" className="text-3xl text-primary-400" />
                                <span className="text-xl font-bold">Learner Bot</span>
                            </div>
                            <p className="text-gray-400">
                                Your AI-powered learning companion for a better educational experience.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/login" className="text-gray-400 hover:text-primary-400 transition-colors">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/signup" className="text-gray-400 hover:text-primary-400 transition-colors">
                                        Sign Up
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/chat" className="text-gray-400 hover:text-primary-400 transition-colors">
                                        Chat
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Contact</h3>
                            <p className="text-gray-400">
                                Have questions? We're here to help!
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 Learner Bot. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
