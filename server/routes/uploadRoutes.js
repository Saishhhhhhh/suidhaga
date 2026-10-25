const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure destination folder exists (with safe try-catch for read-only serverless filesystems)
const uploadDir = path.join(__dirname, '../../public/uploads/products');
let diskAvailable = true;
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  diskAvailable = false;
}

const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION || !diskAvailable);

// Configure Multer storage
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
    cb(null, `sd-${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

const storage = isVercel ? multer.memoryStorage() : diskStorage;

// File filter: only images allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|avif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  if (allowedTypes.test(ext) || mime.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP, GIF, AVIF) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per image
});

const getFileUrl = (file) => {
  if (file.buffer) {
    // Memory storage (Vercel serverless) -> return base64 Data URL
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
  // Disk storage -> return public path
  return `/uploads/products/${file.filename}`;
};


/**
 * POST /api/upload/image (Single image upload)
 */
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const publicUrl = getFileUrl(req.file);
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: publicUrl,
      filename: req.file.filename || req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/upload/images (Multiple images upload up to 10)
 */
router.post('/images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }
    const urls = req.files.map(getFileUrl);
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      urls: urls,
      files: req.files.map((f) => ({
        url: getFileUrl(f),
        filename: f.filename || f.originalname,
        size: f.size,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
