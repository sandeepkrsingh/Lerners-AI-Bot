import mongoose, { Schema, models } from 'mongoose';

export interface ICorpus {
    _id: string;
    title: string;
    type: 'document' | 'policy' | 'syllabus' | 'faq' | 'manual';
    sourceType: 'text' | 'pdf' | 'excel' | 'csv' | 'weblink';
    content: string; // For text content or extracted content from files
    fileUrl?: string; // For uploaded files
    webLink?: string; // For web links
    fileName?: string; // Original file name
    fileSize?: number; // File size in bytes
    description?: string;
    uploadedBy: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CorpusSchema = new Schema<ICorpus>({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    type: {
        type: String,
        enum: ['document', 'policy', 'syllabus', 'faq', 'manual'],
        required: true,
    },
    sourceType: {
        type: String,
        enum: ['text', 'pdf', 'excel', 'csv', 'weblink'],
        default: 'text',
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    fileUrl: String,
    webLink: String,
    fileName: String,
    fileSize: Number,
    description: String,
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

const Corpus = models.Corpus || mongoose.model<ICorpus>('Corpus', CorpusSchema);

export default Corpus;

