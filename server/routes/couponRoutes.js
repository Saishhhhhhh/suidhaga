const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { verifyAdmin } = require('../middleware/auth');

const DEFAULT_COUPONS = [
  {
    code: 'SUI-DIWALI50',
    description: 'Special Diwali 50% Off on all products (Manual Entry)',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    code: 'DIWALI15',
    description: 'Grand Festive Edit 15% Off',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    code: 'SUIDHAGA10',
    description: 'Welcome 10% Off on Festive Wear',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    isActive: true,
  },
];

// Helper to seed default coupons if database has none
async function ensureDefaultCoupons() {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(DEFAULT_COUPONS);
      console.log('🎉 Default coupons seeded including SUI-DIWALI50 (50% Off)');
    } else {
      // Ensure SUI-DIWALI50 exists specifically
      const exists = await Coupon.findOne({ code: 'SUI-DIWALI50' });
      if (!exists) {
        await Coupon.create(DEFAULT_COUPONS[0]);
        console.log('🎉 SUI-DIWALI50 (50% Off) coupon created in database');
      }
    }
  } catch (err) {
    console.warn('Coupon seed notice:', err.message);
  }
}

// Auto-run check on startup
ensureDefaultCoupons();

// POST /api/coupons/validate - Public (used by Cart & Checkout)
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
    }

    const cleanCode = code.trim().toUpperCase();
    let coupon = await Coupon.findOne({ code: cleanCode });

    // Fallback if DB doesn't have it yet:
    if (!coupon) {
      const defaultMatch = DEFAULT_COUPONS.find((c) => c.code === cleanCode);
      if (defaultMatch) {
        try {
          coupon = await Coupon.create(defaultMatch);
        } catch (e) {
          coupon = defaultMatch;
        }
      }
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code. Please check and try again.' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" is currently inactive.` });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" has expired.` });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" usage limit has been reached.` });
    }

    const numericSubtotal = Number(subtotal) || 0;
    if (coupon.minOrderAmount && numericSubtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for coupon "${cleanCode}".`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((numericSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(numericSubtotal, coupon.discountValue);
    }

    return res.json({
      success: true,
      message:
        cleanCode === 'SUI-DIWALI50'
          ? '🎉 Special 50% Diwali Discount Applied! 50% off added to your cart.'
          : `🎉 Coupon "${coupon.code}" applied successfully!`,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        percent: coupon.discountType === 'percentage' ? coupon.discountValue : 0,
        discountAmount,
      },
    });
  } catch (err) {
    console.error('Validate coupon error:', err);
    return res.status(500).json({ success: false, message: 'Failed to validate coupon code.' });
  }
});

// GET /api/coupons - Protected (Admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    await ensureDefaultCoupons();
    const { search, status } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ code: regex }, { description: regex }];
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    console.error('Get coupons error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
});

// POST /api/coupons - Protected (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const {
      code,
      description = '',
      discountType = 'percentage',
      discountValue,
      minOrderAmount = 0,
      maxDiscountAmount = null,
      usageLimit = null,
      expiresAt = null,
      isActive = true,
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" already exists.` });
    }

    if (!discountValue || Number(discountValue) <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid discount value greater than 0.' });
    }

    if (discountType === 'percentage' && Number(discountValue) > 100) {
      return res.status(400).json({ success: false, message: 'Percentage discount cannot exceed 100%.' });
    }

    const coupon = new Coupon({
      code: cleanCode,
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: Boolean(isActive),
    });

    const saved = await coupon.save();
    res.status(201).json({ success: true, message: `Coupon "${saved.code}" created successfully!`, coupon: saved });
  } catch (err) {
    console.error('Create coupon error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create coupon' });
  }
});

// PUT /api/coupons/:id - Protected (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      expiresAt,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    if (code) {
      const cleanCode = code.trim().toUpperCase();
      if (cleanCode !== coupon.code) {
        const existing = await Coupon.findOne({ code: cleanCode, _id: { $ne: id } });
        if (existing) {
          return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" already exists.` });
        }
        coupon.code = cleanCode;
      }
    }

    if (description !== undefined) coupon.description = description.trim();
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) {
      if (Number(discountValue) <= 0) {
        return res.status(400).json({ success: false, message: 'Discount value must be greater than 0.' });
      }
      if (coupon.discountType === 'percentage' && Number(discountValue) > 100) {
        return res.status(400).json({ success: false, message: 'Percentage discount cannot exceed 100%.' });
      }
      coupon.discountValue = Number(discountValue);
    }
    if (minOrderAmount !== undefined) coupon.minOrderAmount = Number(minOrderAmount) || 0;
    if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount ? Number(maxDiscountAmount) : null;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit ? Number(usageLimit) : null;
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);

    const updated = await coupon.save();
    res.json({ success: true, message: `Coupon "${updated.code}" updated successfully!`, coupon: updated });
  } catch (err) {
    console.error('Update coupon error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update coupon' });
  }
});

// PATCH /api/coupons/:id/toggle - Protected (Admin only)
router.patch('/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" is now ${coupon.isActive ? 'Active' : 'Inactive'}.`,
      coupon,
    });
  } catch (err) {
    console.error('Toggle coupon error:', err);
    res.status(500).json({ success: false, message: 'Failed to toggle coupon status' });
  }
});

// DELETE /api/coupons/:id - Protected (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, message: `Coupon "${coupon.code}" deleted successfully!` });
  } catch (err) {
    console.error('Delete coupon error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
});

module.exports = router;
