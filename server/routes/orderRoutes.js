const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/auth');
const { sendOrderNotificationToAdmin } = require('../services/emailService');

// POST /api/orders - Customer places an order
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      discount = 0,
      shippingFee = 0,
      totalAmount,
      paymentMethod = 'COD',
      phonePeTransactionId = '',
      paymentStatus = 'Pending',
      notes,
    } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.email || !customer.address) {
      return res.status(400).json({ success: false, message: 'Incomplete customer details' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    // Create order
    const order = new Order({
      customer,
      items,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      paymentMethod,
      phonePeTransactionId,
      paymentStatus: paymentMethod === 'PHONEPE' && phonePeTransactionId ? 'Paid' : paymentStatus,
      orderStatus: paymentMethod === 'PHONEPE' && phonePeTransactionId ? 'Confirmed' : 'Pending',
      notes,
    });

    const savedOrder = await order.save();

    // Trigger email notification to Komal (sahamatekomal@gmail.com)
    sendOrderNotificationToAdmin(savedOrder).catch((err) =>
      console.warn('Background order email notice:', err.message)
    );

    // Deduct stock for each item
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        }).catch((err) => console.warn('Could not update stock for product:', item.product, err.message));
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! We will contact you soon.',
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
});

// POST /api/orders/phonepe/initiate - Generate PhonePe payment session / QR payload
router.post('/phonepe/initiate', async (req, res) => {
  try {
    const { amount, customerName, customerPhone } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const merchantTransactionId = `MT_SD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const upiVpa = '8767547514@ybl';
    const merchantName = 'Sui Dhaga';

    // Standard NPCI UPI URI Scheme
    const upiString = `upi://pay?pa=${upiVpa}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Sui-Dhaga Order ${merchantTransactionId}`)}`;
    const phonePeIntentUri = `phonepe://pay?pa=${upiVpa}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Sui-Dhaga Order ${merchantTransactionId}`)}`;

    res.json({
      success: true,
      merchantTransactionId,
      amount,
      upiVpa,
      merchantName,
      upiString,
      phonePeIntentUri,
      status: 'INITIATED',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error initiating PhonePe payment', error: err.message });
  }
});

// GET /api/orders/track/:query - Customer tracks by order ID or phone number
router.get('/track/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const cleanQuery = query.trim();

    const orders = await Order.find({
      $or: [
        { orderId: cleanQuery },
        { 'customer.phone': cleanQuery },
        { trackingNumber: cleanQuery },
      ],
    }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found matching this Order ID or Phone number' });
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error tracking order', error: error.message });
  }
});

// GET /api/orders - Admin lists orders
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (search && search.trim()) {
      const s = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: s },
        { 'customer.name': s },
        { 'customer.phone': s },
        { 'customer.email': s },
        { trackingNumber: s },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
});

// GET /api/orders/stats/summary - Admin dashboard order stats
router.get('/stats/summary', verifyAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['Pending', 'Confirmed'] } });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        statusCounts,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order stats', error: error.message });
  }
});

// PUT /api/orders/:id/status - Admin update order status or tracking
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { orderStatus, trackingNumber, paymentStatus } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order updated successfully', order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/orders/:id - Admin delete order
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
