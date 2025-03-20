const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const councilMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'counselor', 'member'],
        default: 'member'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
councilMemberSchema.pre('save', async function(next) {
    const member = this;
    if (member.isModified('password')) {
        member.password = await bcrypt.hash(member.password, 8);
    }
    next();
});

module.exports = mongoose.model('CouncilMember', councilMemberSchema); 