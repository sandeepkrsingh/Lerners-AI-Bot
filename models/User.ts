import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'student' | 'faculty' | 'mentor' | 'admin';
    permissions: {
        manageUsers: boolean;
        manageCorpus: boolean;
        manageDB: boolean;
        viewChats: boolean;
    };
    isActive: boolean;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'mentor', 'admin'],
        default: 'student',
    },
    permissions: {
        manageUsers: { type: Boolean, default: false },
        manageCorpus: { type: Boolean, default: false },
        manageDB: { type: Boolean, default: false },
        viewChats: { type: Boolean, default: false },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
