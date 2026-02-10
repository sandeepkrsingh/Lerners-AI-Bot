import mongoose, { Schema, models } from 'mongoose';

export interface IAIRule {
    _id: string;
    rule: string;
    category: 'behavior' | 'safety' | 'response_style' | 'domain_boundary';
    priority: 'low' | 'medium' | 'high' | 'critical';
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const AIRuleSchema = new Schema<IAIRule>({
    rule: {
        type: String,
        required: [true, 'Please define the rule'],
    },
    category: {
        type: String,
        enum: ['behavior', 'safety', 'response_style', 'domain_boundary'],
        default: 'behavior',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const AIRule = models.AIRule || mongoose.model<IAIRule>('AIRule', AIRuleSchema);

export default AIRule;
