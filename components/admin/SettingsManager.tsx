"use client";

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Settings {
    _id: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: 'light' | 'dark';
    appName: string;
}

interface SettingsManagerProps {
    onRefresh?: () => void;
}

export default function SettingsManager({ onRefresh }: SettingsManagerProps) {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [formData, setFormData] = useState({
        logo: '/dpu-logo.svg',
        primaryColor: '#3b82f6',
        secondaryColor: '#ec4899',
        accentColor: '#8b5cf6',
        theme: 'light' as 'light' | 'dark',
        appName: 'DPU Centre for Online Learning',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data.settings);
                setFormData({
                    logo: data.settings.logo,
                    primaryColor: data.settings.primaryColor,
                    secondaryColor: data.settings.secondaryColor,
                    accentColor: data.settings.accentColor,
                    theme: data.settings.theme,
                    appName: data.settings.appName,
                });
                setLogoPreview(data.settings.logo);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let logoPath = formData.logo;

            // If new logo file, convert to base64
            if (logoFile) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    logoPath = event.target?.result as string;
                    await saveSettings(logoPath);
                };
                reader.readAsDataURL(logoFile);
            } else {
                await saveSettings(logoPath);
            }
        } catch (error) {
            alert('Failed to save settings');
            setSaving(false);
        }
    };

    const saveSettings = async (logoPath: string) => {
        const res = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                logo: logoPath,
            }),
        });

        if (res.ok) {
            alert('Settings saved successfully! Refresh the page to see changes.');
            fetchSettings();
            if (onRefresh) onRefresh();
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to save settings');
        }
        setSaving(false);
    };

    const handleReset = () => {
        if (settings) {
            setFormData({
                logo: settings.logo,
                primaryColor: settings.primaryColor,
                secondaryColor: settings.secondaryColor,
                accentColor: settings.accentColor,
                theme: settings.theme,
                appName: settings.appName,
            });
            setLogoPreview(settings.logo);
            setLogoFile(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Icon icon="mdi:loading" className="text-4xl text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Application Settings</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Icon icon="mdi:loading" className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Icon icon="mdi:content-save" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:image" className="text-2xl text-blue-600" />
                        Logo
                    </h3>
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo Preview" className="max-h-24 mx-auto mb-4" />
                            ) : (
                                <Icon icon="mdi:image-outline" className="text-6xl text-gray-300 mx-auto mb-4" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                                id="logo-upload"
                            />
                            <label
                                htmlFor="logo-upload"
                                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
                            >
                                Choose Logo
                            </label>
                            <p className="text-sm text-gray-500 mt-2">PNG, JPG, SVG (Max 2MB)</p>
                        </div>
                    </div>
                </div>

                {/* App Name */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:text" className="text-2xl text-green-600" />
                        Application Name
                    </h3>
                    <input
                        type="text"
                        value={formData.appName}
                        onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="Enter app name"
                    />
                </div>

                {/* Primary Color */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:palette" className="text-2xl text-blue-600" />
                        Primary Color
                    </h3>
                    <div className="flex gap-4 items-center">
                        <input
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
                        />
                        <input
                            type="text"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                            placeholder="#3b82f6"
                        />
                    </div>
                </div>

                {/* Secondary Color */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:palette" className="text-2xl text-pink-600" />
                        Secondary Color
                    </h3>
                    <div className="flex gap-4 items-center">
                        <input
                            type="color"
                            value={formData.secondaryColor}
                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                            className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
                        />
                        <input
                            type="text"
                            value={formData.secondaryColor}
                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                            placeholder="#ec4899"
                        />
                    </div>
                </div>

                {/* Accent Color */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:palette" className="text-2xl text-purple-600" />
                        Accent Color
                    </h3>
                    <div className="flex gap-4 items-center">
                        <input
                            type="color"
                            value={formData.accentColor}
                            onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                            className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
                        />
                        <input
                            type="text"
                            value={formData.accentColor}
                            onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                            placeholder="#8b5cf6"
                        />
                    </div>
                </div>

                {/* Theme Toggle */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:theme-light-dark" className="text-2xl text-gray-600" />
                        Theme
                    </h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setFormData({ ...formData, theme: 'light' })}
                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${formData.theme === 'light'
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <Icon icon="mdi:white-balance-sunny" className="text-2xl mx-auto mb-1" />
                            Light
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, theme: 'dark' })}
                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${formData.theme === 'dark'
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <Icon icon="mdi:moon-waning-crescent" className="text-2xl mx-auto mb-1" />
                            Dark
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Icon icon="mdi:eye" className="text-2xl text-indigo-600" />
                    Preview
                </h3>
                <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        {logoPreview && <img src={logoPreview} alt="Logo" className="h-12" />}
                        <span className="text-xl font-bold">{formData.appName}</span>
                    </div>
                    <div className="flex gap-4">
                        <div
                            className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: formData.primaryColor }}
                        >
                            Primary
                        </div>
                        <div
                            className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: formData.secondaryColor }}
                        >
                            Secondary
                        </div>
                        <div
                            className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: formData.accentColor }}
                        >
                            Accent
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
