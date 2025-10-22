import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // Markdown content
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['Draft', 'Published'], 
        default: 'Draft' 
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
}, { timestamps: true });

// Pre-save hook to set publishedAt when status changes to 'Published'
postSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'Published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

export default mongoose.model('Post', postSchema);