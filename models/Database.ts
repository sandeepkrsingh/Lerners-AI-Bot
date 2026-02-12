import mongoose, { Schema, models } from 'mongoose';

export interface IDatabase {
    _id: string;
    name: string;
    description?: string;
    schema: Record<string, any>; // JSON schema definition
    data: Record<string, any>[]; // Array of data records
    category: 'learner_records' | 'academic_data' | 'logs' | 'other';
    uploadedBy: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DatabaseSchema = new Schema<IDatabase>({
    name: {
        type: String,
        required: [true, 'Please provide a database name'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    schema: {
        type: Schema.Types.Mixed,
        required: [true, 'Please provide a schema definition'],
    },
    data: {
        type: [Schema.Types.Mixed],
        default: [],
    } as any,
    category: {
        type: String,
        enum: ['learner_records', 'academic_data', 'logs', 'other'],
        default: 'other',
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Database = models.Database || mongoose.model<IDatabase>('Database', DatabaseSchema);

export default Database;
