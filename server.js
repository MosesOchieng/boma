const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(express.static('public'));

// Routes
app.use(authRoutes);

// Protected routes example
app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.json({ message: 'Welcome to the dashboard' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 