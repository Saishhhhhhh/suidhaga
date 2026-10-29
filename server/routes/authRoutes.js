const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyAdmin } = require('../middleware/auth');
const AdminUser = require('../models/AdminUser');

// Helper to ensure an AdminUser exists in DB
async function getOrCreateAdmin() {
  const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@suidhaga.com').toLowerCase();
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';

  let admin = await AdminUser.findOne({});
  if (!admin) {
    admin = await AdminUser.create({
      name: 'Komal (Store Owner)',
      email: defaultEmail,
      password: defaultPassword,
      phone: '+91 87675 47514',
      role: 'admin',
    });
  }
  return admin;
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@suidhaga.com').toLowerCase();
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = null;
    try {
      admin = await getOrCreateAdmin();
    } catch (dbErr) {
      console.warn('DB connection notice during admin login, using fallback credentials:', dbErr.message);
    }

    // Match credentials from DB (or env fallback)
    const isMatch =
      (admin && admin.email.toLowerCase() === cleanEmail && admin.password === password) ||
      (cleanEmail === defaultAdminEmail && password === defaultAdminPassword);

    if (isMatch) {
      const adminId = admin ? admin._id : 'admin_default_id';
      const adminName = admin ? admin.name : 'Komal (Store Owner)';
      const adminPhone = admin ? (admin.phone || '+91 87675 47514') : '+91 87675 47514';

      const token = jwt.sign(
        { id: adminId, email: cleanEmail, role: 'admin' },
        process.env.JWT_SECRET || 'suidhaga_super_secret_jwt_key_2026_festive',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Admin logged in successfully',
        token,
        admin: {
          id: adminId,
          email: cleanEmail,
          name: adminName,
          phone: adminPhone,
          role: 'admin',
        },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
});

// GET /api/auth/me or GET /api/auth/profile
router.get('/profile', verifyAdmin, async (req, res) => {
  try {
    const admin = await getOrCreateAdmin();
    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/me', verifyAdmin, async (req, res) => {
  try {
    const admin = await getOrCreateAdmin();
    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/profile - Update name, email, phone
router.put('/profile', verifyAdmin, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const admin = await getOrCreateAdmin();

    if (name) admin.name = name.trim();
    if (email) admin.email = email.trim().toLowerCase();
    if (phone) admin.phone = phone.trim();

    await admin.save();

    res.json({
      success: true,
      message: 'Admin profile updated successfully!',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/change-password - Change admin password
router.put('/change-password', verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 4 characters long',
      });
    }

    const admin = await getOrCreateAdmin();

    if (currentPassword && admin.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully! Please keep it secure.',
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
