const express = require('express');
const router = express.Router();
const CouncilMember = require('../models/CouncilMember');
const jwt = require('jsonwebtoken');

router.post('/api/council/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find council member
        const councilMember = await CouncilMember.findOne({ email });
        if (!councilMember) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isValid = await councilMember.verifyPassword(password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: councilMember._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                name: councilMember.name,
                email: councilMember.email,
                role: councilMember.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
});

module.exports = router; 