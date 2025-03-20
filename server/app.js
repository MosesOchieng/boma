const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
const supportRoutes = require('./routes/support');
const resourceRoutes = require('./routes/resources');
const assessmentRoutes = require('./routes/assessments');

app.use('/api/support', supportRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/assessments', assessmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 