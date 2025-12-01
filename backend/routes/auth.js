const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Simple login - no bcrypt for now
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('📝 Login attempt:', { username, password });

    // Simple check
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { username: 'admin', role: 'admin' },
        'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('✅ Login successful');
      
      return res.json({
        success: true,
        token,
        user: {
          username: 'admin',
          role: 'admin'
        }
      });
    }

    console.log('❌ Invalid credentials');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, 'your-secret-key');
    
    res.json({
      success: true,
      user: {
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;