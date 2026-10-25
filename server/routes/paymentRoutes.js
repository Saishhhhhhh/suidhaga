const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const phonepeService = require('../services/phonepeService');
const { sendOrderNotificationToAdmin } = require('../services/emailService');

/**
 * Public PhonePe Gateway Configuration
 */
router.get('/config', (req, res) => {
  const config = phonepeService.getConfig();
  res.json({
    success: true,
    enabled: true,
    merchantId: config.merchantId,
    merchantName: config.merchantName,
    env: config.env,
  });
});

/**
 * Initiate PhonePe Standard Checkout Order
 * POST /api/payment/phonepe/initiate
 */
router.post('/phonepe/initiate', async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      discount = 0,
      shippingFee = 0,
      totalAmount,
      notes = '',
    } = req.body;

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ success: false, message: 'Customer details are required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order amount' });
    }

    // Generate unique merchant order ID for PhonePe
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const merchantOrderId = `SD-${dateStr}-${rand}`;

    // Create order record in MongoDB
    const newOrder = new Order({
      orderId: merchantOrderId,
      customer,
      items,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      paymentMethod: 'PHONEPE',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      notes,
    });

    await newOrder.save();

    // Determine redirect URL
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:5173';
    const redirectUrl = `${origin}/payment-callback?orderId=${merchantOrderId}`;

    // Call PhonePe V2 Checkout API
    const payResult = await phonepeService.createPayment({
      merchantOrderId,
      amountInRupees: totalAmount,
      customer,
      redirectUrl,
      message: `Sui Dhaga Luxury Outfits #${merchantOrderId}`,
    });

    res.json({
      success: true,
      orderId: merchantOrderId,
      dbId: newOrder._id,
      redirectUrl: payResult.redirectUrl,
      phonepeOrderId: payResult.orderId,
    });
  } catch (error) {
    console.error('Error initiating PhonePe payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate PhonePe payment session',
    });
  }
});

/**
 * Check PhonePe Order Status & Update Order
 * GET /api/payment/phonepe/status/:orderId
 */
router.get('/phonepe/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch order from DB
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found in database' });
    }

    // Query PhonePe for live status
    const statusResult = await phonepeService.checkOrderStatus(orderId);

    if (statusResult.success) {
      if (statusResult.state === 'COMPLETED') {
        order.paymentStatus = 'Paid';
        order.orderStatus = 'Confirmed';
        if (statusResult.paymentDetails && statusResult.paymentDetails.length > 0) {
          order.phonePeTransactionId =
            statusResult.paymentDetails[0].payReferenceId || statusResult.orderId;
        } else {
          order.phonePeTransactionId = statusResult.orderId || 'SUCCESS';
        }
        await order.save();

        // Send order notification email to Komal
        sendOrderNotificationToAdmin(order).catch((err) =>
          console.warn('Background PhonePe order email notice:', err.message)
        );
      } else if (statusResult.state === 'FAILED') {
        order.paymentStatus = 'Failed';
        await order.save();
      }

      return res.json({
        success: true,
        state: statusResult.state, // 'COMPLETED', 'PENDING', 'FAILED'
        order,
        paymentDetails: statusResult.paymentDetails,
      });
    } else {
      // If PhonePe status check could not reach gateway, return current DB order state
      return res.json({
        success: true,
        state: order.paymentStatus === 'Paid' ? 'COMPLETED' : 'PENDING',
        order,
        notice: statusResult.error,
      });
    }
  } catch (error) {
    console.error('Error checking PhonePe status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking PhonePe payment status',
    });
  }
});

/**
 * Admin: Get PhonePe Settings
 * GET /api/payment/admin/settings
 */
router.get('/admin/settings', (req, res) => {
  res.json({
    success: true,
    settings: phonepeService.getConfig(),
  });
});

/**
 * Admin: Update PhonePe Settings
 * POST /api/payment/admin/settings
 */
router.post('/admin/settings', (req, res) => {
  try {
    phonepeService.updateConfig(req.body);
    res.json({
      success: true,
      message: 'PhonePe credentials and environment updated successfully!',
      settings: phonepeService.getConfig(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Admin: Test Live Connection Ping
 * POST /api/payment/admin/test
 */
router.post('/admin/test', async (req, res) => {
  try {
    const result = await phonepeService.testConnection(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Admin: List Recent PhonePe Transactions
 * GET /api/payment/admin/transactions
 */
router.get('/admin/transactions', async (req, res) => {
  try {
    const transactions = await Order.find({ paymentMethod: 'PHONEPE' })
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      totalTransactions: transactions.length,
      paidCount: transactions.filter((t) => t.paymentStatus === 'Paid').length,
      pendingCount: transactions.filter((t) => t.paymentStatus === 'Pending').length,
      totalVolume: transactions
        .filter((t) => t.paymentStatus === 'Paid')
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0),
    };

    res.json({
      success: true,
      transactions,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
