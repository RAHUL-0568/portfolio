const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Enable Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static assets (for serving downloadable resume RAHUL_Resume.pdf)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Database
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('[DATABASE] MongoDB connected successfully.');
    
    // Seed initial Administrative account if none exists
    const Admin = require('./models/Admin');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new Admin({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      });
      await defaultAdmin.save();
      console.log(`[SEEDING] Default administrator account seeded. Username: "${defaultAdmin.username}" | Password: "${process.env.ADMIN_PASSWORD || 'admin123'}"`);
    }
  })
  .catch(err => {
    console.error('[DATABASE] Connection failure:', err.message);
  });

// Map API Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));

// Root Ping Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Serve frontend in production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[SERVER] Express server running on port: ${PORT}`);
});
