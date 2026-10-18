const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

function makeSlug(text, id) {
  const base = String(text || 'product')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${base.slice(0, 50)}-${id || Math.floor(100 + Math.random() * 900)}`;
}

function extractFabric(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('chanderi')) return 'Pure Chanderi Silk';
  if (text.includes('modal sateen') || text.includes('modal satin')) return 'Modal Sateen Silk';
  if (text.includes('muslin')) return 'Muslin Silk';
  if (text.includes('crape silk') || text.includes('crap silk')) return 'Pure Crape Silk';
  if (text.includes('georgette')) return 'Pure Georgette';
  if (text.includes('organza')) return 'Organza Blend';
  if (text.includes('cotton silk')) return 'Cotton Silk Blend';
  if (text.includes('satin linen') || text.includes('linen')) return 'Satin Linen Blend';
  if (text.includes('cotton')) return 'Fine Cotton';
  if (text.includes('silk')) return 'Silk Blend';
  return 'Artisanal Silk Blend';
}

async function runImport() {
  const csvFilePath = path.join(__dirname, '../wc-product-export-18-10-2026-1792339483921.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV file not found at:', csvFilePath);
    process.exit(1);
  }

  console.log('🌿 Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const rows = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (d) => rows.push(d))
    .on('end', async () => {
      try {
        console.log(`📊 Processing ${rows.length} CSV rows...`);

        // 1. Build variation price & size map
        const variationMap = {};
        rows.filter((r) => r.Type === 'variation').forEach((v) => {
          const parent = v.Parent || '';
          const sale = parseFloat(v['Sale price']) || 0;
          const reg = parseFloat(v['Regular price']) || 0;
          const size = v['Attribute 1 value(s)'];

          if (!variationMap[parent]) {
            variationMap[parent] = { prices: [], regularPrices: [], sizes: new Set() };
          }
          if (sale > 0) variationMap[parent].prices.push(sale);
          if (reg > 0) variationMap[parent].regularPrices.push(reg);
          if (size) variationMap[parent].sizes.add(size.trim());
        });

        // 2. Filter main products
        const mainProducts = rows.filter((r) => r.Type !== 'variation');
        console.log(`Found ${mainProducts.length} main products to import.`);

        let insertedCount = 0;
        let updatedCount = 0;

        for (const p of mainProducts) {
          const rawId = p['\ufeffID'] || p['ID'] || p.id || '';
          const sku = (p.SKU || '').trim() || `SD-${rawId}`;
          const title = (p.Name || '').trim();
          if (!title) continue;

          const varInfo = variationMap[sku] || variationMap[rawId];

          let price = parseFloat(p['Sale price'] || p['Regular price']);
          let originalPrice = parseFloat(p['Regular price']);

          if ((!price || isNaN(price)) && varInfo && varInfo.prices.length > 0) {
            price = Math.min(...varInfo.prices);
          }
          if ((!originalPrice || isNaN(originalPrice)) && varInfo && varInfo.regularPrices.length > 0) {
            originalPrice = Math.max(...varInfo.regularPrices);
          }

          // Fallbacks if no price in main or variation
          if (!price || isNaN(price) || price === 0) {
            price = 1999;
          }
          if (!originalPrice || isNaN(originalPrice) || originalPrice < price) {
            originalPrice = Math.round(price * 1.25);
          }

          const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

          // Category
          const rawCats = p.Categories ? p.Categories.split(',').map((c) => c.trim()).filter(Boolean) : [];
          const primaryCat = rawCats.length > 0 ? rawCats[0] : 'Co-ord Sets';

          // Images
          const rawImages = p.Images ? p.Images.split(',').map((img) => img.trim()).filter(Boolean) : [];
          const uniqueImages = [...new Set(rawImages)];
          const images = uniqueImages.length > 0 ? uniqueImages : ['/assets/maroon_anarkali.jpg'];

          // Sizes
          let sizes = [];
          if (p['Attribute 1 value(s)']) {
            sizes = p['Attribute 1 value(s)'].split(',').map((s) => s.trim()).filter(Boolean);
          } else if (varInfo && varInfo.sizes.size > 0) {
            sizes = Array.from(varInfo.sizes);
          }
          if (sizes.length === 0) {
            sizes = ['XS', 'S', 'M', 'L', 'XL'];
          }

          // Tags
          const tags = p.Tags ? p.Tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

          // Clean Description
          const rawDesc = p.Description || p['Short description'] || '';
          const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').trim();

          const shortDesc = (p['Short description'] || cleanDesc.slice(0, 160))
            .replace(/<[^>]*>?/gm, '')
            .trim();

          const fabric = extractFabric(title, cleanDesc);

          const productDoc = {
            title,
            slug: makeSlug(title, rawId),
            sku,
            price,
            originalPrice,
            discount,
            category: primaryCat,
            fabric,
            images,
            sizes,
            tags,
            description: cleanDesc || `${title} crafted with elegance and fine needlework by Sui Dhaga by Komal.`,
            shortDescription: shortDesc || 'Timeless Indian ethnic & Indo-Western wear blending tradition with modern style.',
            stock: parseInt(p.Stock || '15', 10) || 15,
            isFeatured: p['Is featured?'] === '1' || p['Is featured?'] === 1,
            isBestseller: p['Is featured?'] === '1' || insertedCount < 8,
            isNewArrival: true,
            wpId: String(rawId),
            wpSource: 'wordpress_csv',
          };

          const filter = rawId ? { wpId: String(rawId) } : { sku };
          const existing = await Product.findOne(filter);

          if (existing) {
            await Product.updateOne(filter, productDoc);
            updatedCount++;
          } else {
            await new Product(productDoc).save();
            insertedCount++;
          }
        }

        console.log(`\n🎉 IMPORT COMPLETED!`);
        console.log(`Inserted: ${insertedCount} new products`);
        console.log(`Updated: ${updatedCount} existing products`);
        console.log(`Total in database: ${await Product.countDocuments()}`);

        const distinctCats = await Product.distinct('category');
        console.log('Active Categories in MongoDB:', distinctCats);

        process.exit(0);
      } catch (err) {
        console.error('❌ Error during import:', err);
        process.exit(1);
      }
    });
}

runImport();
