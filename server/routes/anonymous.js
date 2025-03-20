const express = require('express');
const router = express.Router();
const AnonymousCase = require('../models/AnonymousCase');

router.post('/api/submit-anonymous', async (req, res) => {
    try {
        // Create new case
        const newCase = new AnonymousCase({
            ...req.body,
            caseId: generateCaseId(), // Implement this function
            status: 'new'
        });

        await newCase.save();

        // Send success response
        res.json({
            success: true,
            message: 'Case submitted successfully',
            caseId: newCase.caseId
        });

    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during submission'
        });
    }
});

function generateCaseId() {
    // Generate a unique case ID (implement your own logic)
    return 'CASE-' + Date.now().toString(36).toUpperCase();
}

module.exports = router; 