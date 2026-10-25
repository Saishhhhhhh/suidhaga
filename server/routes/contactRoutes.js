const express = require('express');
const router = express.Router();
const ContactInquiry = require('../models/ContactInquiry');
const { verifyAdmin } = require('../middleware/auth');
const { sendContactNotificationToAdmin } = require('../services/emailService');

// POST /api/contact - Customer submits contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Your name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Your phone number is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please include a short message.' });
    }

    const inquiry = new ContactInquiry({
      name: name.trim(),
      email: (email || '').trim().toLowerCase(),
      phone: phone.trim(),
      subject: (subject || 'Outfit Consultation / General Inquiry').trim(),
      message: message.trim(),
    });

    const saved = await inquiry.save();

    // Trigger email notification to Komal
    sendContactNotificationToAdmin(saved).catch((err) =>
      console.warn('Background contact email alert notice:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Komal and our styling team will get back to you shortly.',
      inquiry: saved,
    });
  } catch (error) {
    console.error('Error saving contact inquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to submit inquiry. Please try again.', error: error.message });
  }
});

// GET /api/contact - Admin fetches all inquiries
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    res.status(500).json({ success: false, message: 'Error fetching inquiries', error: error.message });
  }
});

// PATCH /api/contact/:id/status - Admin updates inquiry status
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['New', 'Read', 'Replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const updated = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, inquiry: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating inquiry status', error: error.message });
  }
});

// DELETE /api/contact/:id - Admin deletes inquiry
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting inquiry', error: error.message });
  }
});

module.exports = router;
