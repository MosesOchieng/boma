const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// Get all cases
router.get('/api/cases', async (req, res) => {
    try {
        const cases = await Case.find().sort({ date: -1 });
        res.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Failed to fetch cases' });
    }
});

// Submit new case
router.post('/api/submit-anonymous', async (req, res) => {
    try {
        const newCase = new Case({
            caseId: 'CASE-' + Date.now(),
            ...req.body,
            status: req.body.supportType === 'immediate' ? 'urgent' : 'active',
            date: new Date()
        });

        await newCase.save();
        
        console.log('New case saved:', newCase);

        res.json({
            success: true,
            message: 'Case submitted successfully',
            caseId: newCase.caseId
        });
    } catch (error) {
        console.error('Error saving case:', error);
        res.status(500).json({ error: 'Failed to save case' });
    }
});

// Database health check
router.get('/api/health-check', async (req, res) => {
    try {
        await Case.db.command({ ping: 1 });
        res.json({ status: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'disconnected', error: error.message });
    }
});

module.exports = router; 