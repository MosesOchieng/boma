const jwt = require('jsonwebtoken');
const CouncilMember = require('../models/CouncilMember');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const councilMember = await CouncilMember.findOne({
            _id: decoded._id,
            'tokens.token': token,
            isActive: true
        });

        if (!councilMember) {
            throw new Error();
        }

        // Update last login
        councilMember.lastLogin = new Date();
        await councilMember.save();

        req.token = token;
        req.councilMember = councilMember;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

module.exports = auth; 