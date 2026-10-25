require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

const uploadDir = path.join(__dirname, '../../public/uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function downloadImage(url, localFilePath) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 25000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
    },
  });
  fs.writeFileSync(localFilePath, Buffer.from(response.data));
  return true;
}

async function migrateAllWpImages() {
  console.log('🚀 Starting WordPress to Local Image Migration...');
  console.log('📁 Target upload directory:', uploadDir);

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌿 Connected to MongoDB Atlas');
  }

  const products = await Product.find({});
  console.log(`📦 Found ${products.length} products to evaluate.`);

  let totalDownloaded = 0;
  let totalProductsUpdated = 0;
  let totalErrors = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    let productModified = false;
    const newImages = [];

    const baseSlug = (product.slug || product.title || `product-${product._id}`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);

    for (let imgIdx = 0; imgIdx < product.images.length; imgIdx++) {
      const imgUrl = product.images[imgIdx];

      if (imgUrl && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://'))) {
        try {
          // Extract extension or default to .jpg
          let ext = path.extname(new URL(imgUrl).pathname).toLowerCase();
          if (!ext || ext.length > 5) ext = '.jpg';

          // Name file cleanly: wp-[slug]-[wpId || id]-[imgIdx][ext]
          const identifier = product.wpId || product._id.toString().slice(-6);
          const localFileName = `wp-${baseSlug}-${identifier}-${imgIdx}${ext}`;
          const localFilePath = path.join(uploadDir, localFileName);
          const publicUrl = `/uploads/products/${localFileName}`;

          // Only download if file does not exist locally
          if (!fs.existsSync(localFilePath) || fs.statSync(localFilePath).size === 0) {
            console.log(`⬇️ Downloading [${i + 1}/${products.length}] Image ${imgIdx + 1}: ${imgUrl}`);
            await downloadImage(imgUrl, localFilePath);
          } else {
            console.log(`✓ Image already exists locally: ${localFileName}`);
          }

          newImages.push(publicUrl);
          totalDownloaded++;
          productModified = true;
        } catch (err) {
          console.error(`❌ Failed downloading image: ${imgUrl} - ${err.message}`);
          totalErrors++;
          // Fallback to local default image so no broken link remains
          newImages.push('/assets/maroon_anarkali.jpg');
          productModified = true;
        }
      } else {
        newImages.push(imgUrl);
      }
    }

    if (productModified) {
      product.images = newImages;
      await product.save();
      totalProductsUpdated++;
      console.log(`✅ Updated Product: "${product.title}" with local images.`);
    }
  }

  console.log('\n=============================================');
  console.log('🎉 WordPress Local Image Migration Completed!');
  console.log(`• Products Updated: ${totalProductsUpdated}`);
  console.log(`• Images Stored Locally: ${totalDownloaded}`);
  console.log(`• Download Errors: ${totalErrors}`);
  console.log('• Storage Location: public/uploads/products/');
  console.log('=============================================\n');

  return {
    success: true,
    totalProductsUpdated,
    totalDownloaded,
    totalErrors,
  };
}

// If run directly via node
if (require.main === module) {
  migrateAllWpImages()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal Migration Error:', err);
      process.exit(1);
    });
}

module.exports = migrateAllWpImages;
