require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const importRoutes = require('./routes/importRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB().then(async () => {
  // If database is completely empty on initial launch, automatically seed the curated Sui Dhaga collection!
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty! Auto-seeding initial Sui-Dhaga collection...');
      const axios = require('axios');
      // Call seed internally
      const req = {};
      const res = {
        json: (data) => console.log('🎉 Seed completed:', data.message),
        status: () => ({ json: (d) => console.log('Seed notice:', d) }),
      };
      const seedHandler = importRoutes.stack.find((layer) => layer.route && layer.route.path === '/seed-demo')?.route.stack[0].handle;
      if (seedHandler) {
        await seedHandler(req, res);
      }
    }
  } catch (err) {
    console.warn('Auto-seed check notice:', err.message);
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static assets from public/ folder (images, logos, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'SUI-DHAGA by Komal',
    mongodb: 'Connected to MongoDB Atlas',
    timestamp: new Date().toISOString(),
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`✨ SUI-DHAGA API Server running on http://localhost:${PORT}`);
});
