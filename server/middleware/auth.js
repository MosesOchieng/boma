const jwt = require('jsonwebtoken');
const CouncilMember = require('../models/CouncilMember');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key'); // Use process.env.JWT_SECRET in production
        req.councilMember = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware; 