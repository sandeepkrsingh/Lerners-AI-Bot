import mongoose, { Schema, models } from 'mongoose';

export interface IMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface IChat {
    _id: string;
    userId: mongoose.Types.ObjectId | string;
    title: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatSchema = new Schema<IChat>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            default: 'New Conversation',
        },
        messages: [MessageSchema],
    },
    {
        timestamps: true,
    }
);

const Chat = models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
