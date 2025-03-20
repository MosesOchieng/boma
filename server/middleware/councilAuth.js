const jwt = require('jsonwebtoken');
const CouncilMember = require('../models/CouncilMember');

const councilAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find council member
        const councilMember = await CouncilMember.findOne({ 
            _id: decoded._id,
            'tokens.token': token 
        });

        if (!councilMember) {
            throw new Error();
        }

        // Add council member and token to request
        req.token = token;
        req.councilMember = councilMember;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

module.exports = councilAuth; 