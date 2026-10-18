const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyAdmin } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const validEmail = process.env.ADMIN_EMAIL || 'admin@suidhaga.com';
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  if (email.trim().toLowerCase() === validEmail.toLowerCase() && password === validPassword) {
    const token = jwt.sign(
      { email: validEmail, role: 'admin' },
      process.env.JWT_SECRET || 'suidhaga_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Admin logged in successfully',
      token,
      admin: {
        email: validEmail,
        name: 'Komal (Store Owner)',
        role: 'admin',
      },
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// GET /api/auth/me
router.get('/me', verifyAdmin, (req, res) => {
  res.json({
    success: true,
    admin: {
      email: req.admin.email,
      name: 'Komal (Store Owner)',
      role: req.admin.role,
    },
  });
});

module.exports = router;
