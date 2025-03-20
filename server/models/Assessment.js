const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    anonymousId: {
        type: String,
        required: true
    },
    responses: [{
        question: String,
        answer: String,
        score: Number
    }],
    totalScore: Number,
    recommendation: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assessment', AssessmentSchema); 