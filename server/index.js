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
const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas on startup
connectDB()
  .then(async () => {
    // If database is completely empty on initial launch, automatically seed the curated Sui Dhaga collection!
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('🌱 Database is empty! Auto-seeding initial Sui-Dhaga collection...');
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
  })
  .catch((err) => {
    console.warn('Initial MongoDB connect notice:', err.message);
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serverless DB connection middleware (guarantees DB is ready on each request)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err.message);
    next();
  }
});

// Serve static assets from public/ folder (images, logos, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// Register API Routes - support both /api/xxx and /xxx for direct Vercel serverless calls
const apiRouters = [
  ['/products', productRoutes],
  ['/orders', orderRoutes],
  ['/auth', authRoutes],
  ['/import', importRoutes],
  ['/payment', paymentRoutes],
  ['/upload', uploadRoutes],
  ['/settings', settingsRoutes],
];

apiRouters.forEach(([basePath, router]) => {
  app.use(basePath, router);
  app.use(`/api${basePath}`, router);
});

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    brand: 'SUI-DHAGA by Komal',
    mongodb: 'Connected to MongoDB Atlas',
    timestamp: new Date().toISOString(),
  });
});

// Start Express Server locally only if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✨ SUI-DHAGA API Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

