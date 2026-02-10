import mongoose, { Schema, models } from 'mongoose';

export interface IRole {
    _id: string;
    name: string;
    description?: string;
    permissions: {
        manageUsers: boolean;
        manageRoles: boolean;
        manageCorpus: boolean;
        manageDatabase: boolean;
        manageAIRules: boolean;
        viewAllChats: boolean;
        deleteChats: boolean;
        viewAnalytics: boolean;
    };
    isSystem: boolean; // System roles cannot be deleted (admin, student, faculty, mentor)
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: [true, 'Please provide a role name'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    permissions: {
        manageUsers: { type: Boolean, default: false },
        manageRoles: { type: Boolean, default: false },
        manageCorpus: { type: Boolean, default: false },
        manageDatabase: { type: Boolean, default: false },
        manageAIRules: { type: Boolean, default: false },
        viewAllChats: { type: Boolean, default: false },
        deleteChats: { type: Boolean, default: false },
        viewAnalytics: { type: Boolean, default: false },
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Role = models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
