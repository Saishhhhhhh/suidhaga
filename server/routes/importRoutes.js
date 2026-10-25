const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/auth');

// Multer setup for temporary CSV upload
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

function makeSlug(text) {
  return (
    String(text || 'item')
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.floor(100 + Math.random() * 900)
  );
}

// 1. Direct WordPress / WooCommerce API Import
router.post('/wordpress-api', verifyAdmin, async (req, res) => {
  try {
    let { siteUrl, consumerKey, consumerSecret, perPage = 50 } = req.body;

    if (!siteUrl) {
      return res.status(400).json({ success: false, message: 'WordPress Site URL is required' });
    }

    siteUrl = siteUrl.trim().replace(/\/+$/, '');
    let productsData = [];

    // Attempt 1: Try WooCommerce REST API endpoint
    try {
      const auth =
        consumerKey && consumerSecret
          ? {
              username: consumerKey.trim(),
              password: consumerSecret.trim(),
            }
          : undefined;

      const wcUrl = `${siteUrl}/wp-json/wc/v3/products?per_page=${perPage}`;
      console.log(`Connecting to WooCommerce API: ${wcUrl}`);

      const response = await axios.get(wcUrl, {
        auth,
        timeout: 15000,
        headers: { 'User-Agent': 'SuiDhaga-Importer/1.0' },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        productsData = response.data;
      }
    } catch (wcErr) {
      console.warn('WooCommerce v3 failed, trying WP REST v2 endpoint...', wcErr.message);

      // Attempt 2: Try WP Custom Post Type
      try {
        const wpUrl = `${siteUrl}/wp-json/wp/v2/product?per_page=${perPage}`;
        const wpRes = await axios.get(wpUrl, { timeout: 15000 });
        if (Array.isArray(wpRes.data)) {
          productsData = wpRes.data.map((item) => ({
            id: item.id,
            name: item.title ? item.title.rendered : 'Ethnic Wear',
            description: item.content ? item.content.rendered : '',
            short_description: item.excerpt ? item.excerpt.rendered : '',
            price: 1999,
            regular_price: 2499,
            categories: [{ name: 'Indian Ethnic Wear' }],
            images: [],
          }));
        }
      } catch (wpErr) {
        throw new Error(
          `Could not connect to WordPress API at ${siteUrl}. Please check URL, API keys, or use CSV Import instead. Details: ${wcErr.message}`
        );
      }
    }

    if (!productsData || productsData.length === 0) {
      return res.json({ success: true, message: 'Connected to WordPress, but no products were found.', importedCount: 0 });
    }

    let importedCount = 0;
    const importedProducts = [];

    for (const item of productsData) {
      const title = item.name || (item.title && item.title.rendered) || 'Sui Dhaga Design';
      const cleanDesc = (item.description || item.content?.rendered || '')
        .replace(/<[^>]*>?/gm, '')
        .trim();
      const cleanShortDesc = (item.short_description || item.excerpt?.rendered || '')
        .replace(/<[^>]*>?/gm, '')
        .trim();

      const price = parseFloat(item.price || item.sale_price || item.regular_price) || 1899;
      const originalPrice = parseFloat(item.regular_price) || Math.round(price * 1.3);

      const category =
        Array.isArray(item.categories) && item.categories.length > 0
          ? item.categories[0].name
          : 'Indo-Western';

      const images =
        Array.isArray(item.images) && item.images.length > 0
          ? item.images.map((img) => img.src || img)
          : ['/assets/maroon_anarkali.jpg'];

      const stock = typeof item.stock_quantity === 'number' ? item.stock_quantity : 15;

      const productDoc = {
        title,
        slug: makeSlug(title),
        description: cleanDesc || 'Handcrafted Indian ethnic wear designed with care by Sui Dhaga by Komal.',
        shortDescription: cleanShortDesc || 'Timeless Indian ethnic wear crafted with premium fabrics and modern grace.',
        price,
        originalPrice,
        discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        category,
        images,
        stock,
        wpId: String(item.id || ''),
        wpSource: 'wordpress_api',
        fabric: 'Handcrafted Silk Blend',
      };

      const filter = item.id ? { wpId: String(item.id) } : { title };
      const saved = await Product.findOneAndUpdate(filter, productDoc, {
        upsert: true,
        returnDocument: 'after',
        setDefaultsOnInsert: true,
      });

      importedCount++;
      importedProducts.push(saved);
    }

    res.json({
      success: true,
      message: `Successfully imported ${importedCount} products from WordPress!`,
      importedCount,
      sample: importedProducts.slice(0, 3),
    });
  } catch (error) {
    console.error('WordPress API import error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. WordPress / WooCommerce CSV File Upload
router.post('/wordpress-csv', verifyAdmin, upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        let count = 0;
        const imported = [];

        for (const row of results) {
          const title =
            row['Name'] ||
            row['Title'] ||
            row['post_title'] ||
            row['Product Name'] ||
            row['name'];

          if (!title) continue;

          const rawPrice =
            row['Sale price'] ||
            row['Price'] ||
            row['Regular price'] ||
            row['regular_price'] ||
            '1999';
          const price = parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 1999;

          const rawOriginal =
            row['Regular price'] || row['regular_price'] || String(Math.round(price * 1.35));
          const originalPrice = parseFloat(String(rawOriginal).replace(/[^0-9.]/g, '')) || price;

          const category =
            row['Categories'] ||
            row['category'] ||
            row['Tax: product_cat'] ||
            'Kurtas & Sets';

          const desc = row['Description'] || row['post_content'] || '';
          const shortDesc = row['Short description'] || row['post_excerpt'] || '';

          const rawImages = row['Images'] || row['images'] || row['Image URL'] || '';
          const images = rawImages
            ? rawImages.split(',').map((u) => u.trim()).filter(Boolean)
            : ['/assets/maroon_anarkali.jpg'];

          const stock = parseInt(row['Stock'] || row['stock_quantity'] || '15', 10) || 15;
          const wpId = row['ID'] || row['id'] || '';

          const productData = {
            title: title.trim(),
            slug: makeSlug(title.trim()),
            description: desc.replace(/<[^>]*>?/gm, '').trim() || 'Handcrafted Indian ethnic design by Sui Dhaga by Komal.',
            shortDescription: shortDesc.replace(/<[^>]*>?/gm, '').trim() || 'Timeless Indian ethnic wear blending tradition with modern style.',
            price,
            originalPrice,
            discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
            category: category.split('>')[0].split(',')[0].trim(),
            images,
            stock,
            wpId: String(wpId),
            wpSource: 'wordpress_csv',
            fabric: row['Fabric'] || 'Pure Silk Blend',
          };

          const filter = wpId ? { wpId: String(wpId) } : { title: title.trim() };
          const saved = await Product.findOneAndUpdate(filter, productData, {
            upsert: true,
            returnDocument: 'after',
            setDefaultsOnInsert: true,
          });

          count++;
          imported.push(saved);
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.json({
          success: true,
          message: `Successfully processed CSV and imported ${count} products into MongoDB!`,
          importedCount: count,
          sample: imported.slice(0, 3),
        });
      } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ success: false, message: 'Failed parsing CSV data', error: err.message });
      }
    })
    .on('error', (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.status(500).json({ success: false, message: 'Error reading uploaded CSV', error: err.message });
    });
});

// 3. One-Click Seed Curated Sui Dhaga Indian Ethnic Catalog
router.post('/seed-demo', async (req, res) => {
  try {
    const demoProducts = [
      {
        title: 'Gulrukh Regal Maroon Velvet & Gold Embroidered Gown Set',
        slug: makeSlug('Gulrukh Regal Maroon Velvet Gown'),
        shortDescription: 'Signature deep maroon velvet gown with intricate peacock zardozi embroidery and matching sheer cape.',
        description: 'Embrace timeless majesty with our Gulrukh collection. Hand-embroidered with fine metallic gold threads on royal maroon velvet, this gown comes with a sheer embroidered dupatta cape designed for modern brides and festive celebrations. Crafted stitch by stitch with utmost care.',
        price: 4999,
        originalPrice: 7499,
        discount: 33,
        category: 'Indo-Western',
        fabric: 'Regal Micro Velvet & Organza',
        images: ['/assets/hero_banner.jpg', '/assets/maroon_anarkali.jpg'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        stock: 12,
        isBestseller: true,
        isFeatured: true,
        isNewArrival: true,
        tags: ['Maroon', 'Velvet', 'Festive', 'Indo-Western', 'Zardozi'],
        sku: 'SD-GLR-01',
        wpSource: 'seed',
      },
      {
        title: 'Noor-e-Komal Deep Maroon Anarkali Suit with Sheer Dupatta',
        slug: makeSlug('Noor e Komal Maroon Anarkali'),
        shortDescription: 'Graceful flared silk Anarkali suit with delicate botanical gold zari embroidery and scalloped border.',
        description: 'Named after founder Komal, this iconic maroon Anarkali tells a tale of rooted elegance. Designed with pure handloom Chanderi silk blend, featuring Mughal-inspired golden floral motifs and a lightweight net dupatta with embellished borders.',
        price: 3499,
        originalPrice: 4999,
        discount: 30,
        category: 'Anarkalis',
        fabric: 'Handloom Chanderi Silk Blend',
        images: ['/assets/maroon_anarkali.jpg'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 18,
        isBestseller: true,
        isFeatured: true,
        isNewArrival: false,
        tags: ['Anarkali', 'Maroon', 'Signature', 'Silk'],
        sku: 'SD-NOOR-02',
        wpSource: 'seed',
      },
      {
        title: 'Zeenat Emerald Green Chanderi Straight Kurta & Flared Palazzo Set',
        slug: makeSlug('Zeenat Emerald Green Chanderi Kurta'),
        shortDescription: 'Royal emerald silk straight kurta adorned with intricate gota patti neckline and zari borders.',
        description: 'Vibrant and regal, the Zeenat Kurta Set is tailored for the festive modern woman. Featuring luminous green silk fabric, traditional Rajasthani gota work, paired with wide-leg palazzo pants and sheer tassel dupatta.',
        price: 2799,
        originalPrice: 3899,
        discount: 28,
        category: 'Kurtas & Sets',
        fabric: 'Pure Chanderi Silk with Cotton Lining',
        images: ['/assets/emerald_kurta.jpg'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stock: 22,
        isBestseller: true,
        isFeatured: true,
        isNewArrival: true,
        tags: ['Green', 'Chanderi', 'Kurta Set', 'Gota Patti'],
        sku: 'SD-ZEEN-03',
        wpSource: 'seed',
      },
      {
        title: 'Meher Blush Pink Sequin Handcrafted Georgette Lehenga',
        slug: makeSlug('Meher Blush Pink Georgette Lehenga'),
        shortDescription: 'Pastel rose pink flared lehenga skirt with shimmer thread embroidery, designer choli & dupatta.',
        description: 'A romantic dream in blush pink. The Meher Lehenga features cascading floral embroidery interwoven with subtle micro-sequins that catch the light effortlessly. Ideal for sangeet nights, bridesmaids, and reception parties.',
        price: 5499,
        originalPrice: 7999,
        discount: 31,
        category: 'Lehengas',
        fabric: 'Flowing Georgette & Satin Lining',
        images: ['/assets/blush_lehenga.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 8,
        isBestseller: true,
        isFeatured: true,
        isNewArrival: true,
        tags: ['Lehenga', 'Blush Pink', 'Wedding', 'Sangeet'],
        sku: 'SD-MEHR-04',
        wpSource: 'seed',
      },
      {
        title: 'Jashn Haldi Mustard Peplum Kurta & Flared Sharara Set',
        slug: makeSlug('Jashn Haldi Mustard Sharara Set'),
        shortDescription: 'Bright festive turmeric yellow peplum top with mirror work and dramatic tier-pleated sharara.',
        description: 'Celebrate auspicious occasions with radiant joyous yellow! Hand-adorned with delicate cutwork mirrors and gota lace detailing, this silhouette offers supreme comfort and dramatic twirl moments.',
        price: 3199,
        originalPrice: 4499,
        discount: 29,
        category: 'Kurtas & Sets',
        fabric: 'Soft Georgette & Shantoon',
        images: ['/assets/mustard_sharara.jpg'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stock: 15,
        isBestseller: false,
        isFeatured: true,
        isNewArrival: false,
        tags: ['Sharara', 'Haldi', 'Yellow', 'Mirror Work'],
        sku: 'SD-JASH-05',
        wpSource: 'seed',
      },
      {
        title: 'Roohani Hand-Painted Floral Organza Saree with Scallop Border',
        slug: makeSlug('Roohani Hand Painted Floral Organza Saree'),
        shortDescription: 'Whisper-light ivory and peach organza drape with hand-embroidered rose gold scalloped borders.',
        description: 'Subtle sophistication redefined. Our Roohani drape is crafted from pure featherlight organza, adorned with soft floral motifs and finished with a handcrafted zardozi scalloped border. Comes with an unstitched designer blouse piece.',
        price: 2999,
        originalPrice: 4299,
        discount: 30,
        category: 'Sarees',
        fabric: 'Pure Silk Organza',
        images: ['/assets/organza_saree.jpg'],
        sizes: ['Free Size (5.5m + 0.8m Blouse)'],
        stock: 14,
        isBestseller: true,
        isFeatured: false,
        isNewArrival: true,
        tags: ['Saree', 'Organza', 'Pastel', 'Floral'],
        sku: 'SD-ROOH-06',
        wpSource: 'seed',
      },
      {
        title: 'Sitara Wine Maroon Crop Top, Wide-Leg Palazzo & Sheer Cape Co-ord',
        slug: makeSlug('Sitara Wine Maroon Cape Coord Set'),
        shortDescription: 'Modern fusion 3-piece Indo-Western set in deep rich wine with gold botanical zardozi accents.',
        description: 'For the contemporary woman who loves Indian roots with modern flair. Features a structured sweetheart neck embellished bustier, high-waist fluid palazzo trousers, and a floor-sweeping sheer cape jacket.',
        price: 3899,
        originalPrice: 5299,
        discount: 26,
        category: 'Indo-Western',
        fabric: 'Crepe Silk & Organza Cape',
        images: ['/assets/indowestern_cape.jpg'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stock: 16,
        isBestseller: true,
        isFeatured: true,
        isNewArrival: true,
        tags: ['Indo-Western', 'Cape Set', 'Wine', 'Modern Fusion'],
        sku: 'SD-SITR-07',
        wpSource: 'seed',
      },
    ];

    let inserted = 0;
    for (const item of demoProducts) {
      await Product.findOneAndUpdate(
        { sku: item.sku },
        item,
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      inserted++;
    }

    res.json({
      success: true,
      message: `Successfully seeded ${inserted} curated Sui-Dhaga luxury Indian ethnic wear products into MongoDB!`,
      count: inserted,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/import/download-wp-images
 * Download all external WordPress images locally and update MongoDB
 */
router.post('/download-wp-images', async (req, res) => {
  try {
    const migrateAllWpImages = require('../scripts/downloadWpImagesLocally');
    const result = await migrateAllWpImages();
    res.json({
      success: true,
      message: `Successfully migrated ${result.totalDownloaded} images locally across ${result.totalProductsUpdated} products!`,
      ...result,
    });
  } catch (err) {
    console.error('Error migrating images:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
