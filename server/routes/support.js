const express = require('express');
const router = express.Router();
const AnonymousSupport = require('../models/AnonymousSupport');
const crypto = require('crypto');

// Submit anonymous support request
router.post('/submit', async (req, res) => {
    try {
        const anonymousId = crypto.randomBytes(16).toString('hex');
        const support = new AnonymousSupport({
            anonymousId,
            ...req.body
        });
        await support.save();
        res.status(201).json({ success: true, anonymousId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check support request status
router.get('/status/:anonymousId', async (req, res) => {
    try {
        const support = await AnonymousSupport.findOne({ 
            anonymousId: req.params.anonymousId 
        });
        res.json({ success: true, status: support.status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router; 