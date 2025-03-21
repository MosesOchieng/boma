const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Hardcoded council members for demonstration
// In production, these should be in a database with hashed passwords
const councilMembers = [
    {
        id: 1,
        name: "Alex Odhiambo",
        email: "alex.odhiambo@bihc.com",
        password: "alex othiambo",
        role: "Council Member"
    },
    {
        id: 2,
        name: "Lynn Ngungi",
        email: "lynnngungi@gmail.com",
        password: "lynn ngungi",
        role: "Council Member"
    }
];

router.post('/api/council/login', (req, res) => {
    const { email, password } = req.body;
    
    // Log the attempt (remove in production)
    console.log('Login attempt:', { email, password });

    // Find the council member
    const councilMember = councilMembers.find(member => 
        member.email.toLowerCase() === email.toLowerCase() && 
        member.password === password
    );

    if (councilMember) {
        // Create JWT token
        const token = jwt.sign(
            { 
                id: councilMember.id, 
                email: councilMember.email,
                role: councilMember.role
            },
            'your-secret-key', // Replace with process.env.JWT_SECRET in production
            { expiresIn: '24h' }
        );

        // Send success response
        res.json({
            success: true,
            token,
            councilMember: {
                name: councilMember.name,
                email: councilMember.email,
                role: councilMember.role
            }
        });
    } else {
        // Send error response
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

module.exports = router; 