import mongoose, { Schema, models } from 'mongoose';

export interface ISettings {
    _id: string;
    logo: string; // Path to logo file
    primaryColor: string; // Hex color
    secondaryColor: string; // Hex color
    accentColor: string; // Hex color
    theme: 'light' | 'dark';
    appName: string;
    updatedBy: mongoose.Types.ObjectId;
    updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
    logo: {
        type: String,
        default: '/dpu-logo.svg',
    },
    primaryColor: {
        type: String,
        default: '#3b82f6', // Blue
        validate: {
            validator: (v: string) => /^#[0-9A-F]{6}$/i.test(v),
            message: 'Invalid hex color format'
        }
    },
    secondaryColor: {
        type: String,
        default: '#ec4899', // Pink
        validate: {
            validator: (v: string) => /^#[0-9A-F]{6}$/i.test(v),
            message: 'Invalid hex color format'
        }
    },
    accentColor: {
        type: String,
        default: '#8b5cf6', // Purple
        validate: {
            validator: (v: string) => /^#[0-9A-F]{6}$/i.test(v),
            message: 'Invalid hex color format'
        }
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    },
    appName: {
        type: String,
        default: 'DPU Centre for Online Learning',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Settings = models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
