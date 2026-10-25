const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/auth');

// GET /api/products - Public listing with filters & search
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      fabric,
      bestseller,
      featured,
      newArrival,
      sortBy = 'newest',
      page = 1,
      limit = 24,
    } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (fabric && fabric !== 'All') {
      query.fabric = new RegExp(fabric, 'i');
    }

    if (bestseller === 'true') {
      query.isBestseller = true;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (newArrival === 'true') {
      query.isNewArrival = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { category: searchRegex },
        { fabric: searchRegex },
        { tags: searchRegex },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price_asc') sort = { price: 1 };
    if (sortBy === 'price_desc') sort = { price: -1 };
    if (sortBy === 'discount') sort = { discount: -1 };
    if (sortBy === 'title_asc') sort = { title: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const categories = await Product.distinct('category');
    const fabrics = await Product.distinct('fabric');

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      count: products.length,
      categories,
      fabrics,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message });
  }
});

// GET /api/products/stats/summary - Admin dashboard product metrics
router.get('/stats/summary', verifyAdmin, async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
    ]);
    const wpImported = await Product.countDocuments({ wpSource: { $in: ['wordpress_api', 'wordpress_csv'] } });

    res.json({
      success: true,
      stats: {
        total,
        lowStock,
        outOfStock,
        wpImported,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product stats', error: error.message });
  }
});

// GET /api/products/:idOrSlug - Single product
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    }
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug });
    }
    if (!product) {
      // Try prefix match (e.g. slug without random suffix)
      product = await Product.findOne({ slug: new RegExp(`^${idOrSlug}`, 'i') });
    }
    if (!product) {
      // Try title match from slugified words
      const words = idOrSlug.replace(/-\d+$/, '').split('-').filter(Boolean);
      if (words.length > 0) {
        const regexStr = words.map((w) => `(?=.*${w})`).join('');
        product = await Product.findOne({ title: new RegExp(regexStr, 'i') });
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Related products in same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json({ success: true, product, related });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
});

// POST /api/products - Admin create product
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id - Admin update product
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id - Admin delete product
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
