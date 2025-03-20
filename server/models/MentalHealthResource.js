const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['article', 'video', 'pdf', 'tool'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [String],
    accessLevel: {
        type: String,
        enum: ['public', 'registered', 'private'],
        default: 'public'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', ResourceSchema); 