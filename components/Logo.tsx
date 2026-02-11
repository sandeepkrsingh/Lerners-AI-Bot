"use client";

import { useTheme } from "./ThemeProvider";
import Image from "next/image";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export default function Logo({ className, width = 180, height = 54 }: LogoProps) {
    const { settings } = useTheme();

    const logoSrc = settings?.logo || '/dpu-logo.svg';

    // If it's a data URL (base64) or external URL, we can interpret it.
    // For simplicity, we'll use a standard img tag if it's a data URL, 
    // or next/image if it's a static path (though settings usually save valid paths/URIs)

    return (
        <img
            src={logoSrc}
            alt="App Logo"
            className={className}
            style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto', objectFit: 'contain' }}
        />
    );
}
