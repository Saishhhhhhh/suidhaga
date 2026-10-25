const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'homepage_hero',
    },
    heroTitle: {
      type: String,
      default: 'Crafted by hand, grounded in care.',
    },
    heroSubtitle: {
      type: String,
      default: 'Curated pure silks, artisanal handloom fabrics, and regal silhouettes.',
    },
    heroBannerUrl: {
      type: String,
      default: '/assets/hero_banner.jpg',
    },
    heroBadge: {
      type: String,
      default: 'Grand Festive Edit 2026',
    },
    ctaText: {
      type: String,
      default: 'Explore Collection',
    },
    whatsappNumber: {
      type: String,
      default: '919773001771',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
