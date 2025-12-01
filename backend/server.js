const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes - IMPORTANT: Make sure auth route is here!
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/announcements', require('./routes/announcements'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CBMC API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      gallery: '/api/gallery',
      testimonials: '/api/testimonials',
      memberships: '/api/memberships',
      announcements: '/api/announcements'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

module.exports = app;