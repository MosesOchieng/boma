const express = require('express');
const router = express.Router();
const CouncilMember = require('../models/CouncilMember');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find council member
        const councilMember = await CouncilMember.findOne({ email });
        if (!councilMember) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, councilMember.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = jwt.sign(
            { _id: councilMember._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Save token
        councilMember.tokens = councilMember.tokens.concat({ token });
        await councilMember.save();

        // Send response
        res.json({
            token,
            user: {
                id: councilMember._id,
                name: councilMember.name,
                email: councilMember.email,
                role: councilMember.role
            }
        });

    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

module.exports = router; 