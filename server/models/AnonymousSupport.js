const mongoose = require('mongoose');

const AnonymousSupportSchema = new mongoose.Schema({
    anonymousId: {
        type: String,
        required: true,
        unique: true
    },
    supportType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contactMethod: {
        type: String,
        required: true
    },
    preferredTime: String,
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AnonymousSupport', AnonymousSupportSchema); 