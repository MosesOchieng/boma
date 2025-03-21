const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const councilMembers = [
    {
        id: 1,
        name: "Alex Odhiambo",
        email: "alex.odhiambo@bihc.com",
        password: "alex othiambo", // In production, use hashed passwords
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
    
    const councilMember = councilMembers.find(member => 
        member.email === email && member.password === password
    );

    if (councilMember) {
        const token = jwt.sign(
            { id: councilMember.id, email: councilMember.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

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
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

module.exports = router; 