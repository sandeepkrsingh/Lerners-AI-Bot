"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
    _id: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: 'light' | 'dark';
    appName: string;
}

interface ThemeContextType {
    settings: Settings | null;
    loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    settings: null,
    loading: true,
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data.settings);
                    applyTheme(data.settings);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const applyTheme = (settings: Settings) => {
        const root = document.documentElement;

        // Apply colors
        root.style.setProperty('--primary', hexToRgb(settings.primaryColor));
        root.style.setProperty('--secondary', hexToRgb(settings.secondaryColor));
        root.style.setProperty('--accent', hexToRgb(settings.accentColor));

        // Apply theme mode
        if (settings.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    // Helper to convert hex to rgb (e.g. #3b82f6 -> 59 130 246)
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
            : '59 130 246'; // Default blue
    };

    return (
        <ThemeContext.Provider value={{ settings, loading }}>
            {/* Show loading state or children? 
                Ideally show children immediately to avoid flicker, 
                but maybe with default colors. 
            */}
            <div className={settings?.theme === 'dark' ? 'dark' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
