const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const SiteSettings = require('../models/SiteSettings');

// Helper to get or create hero settings
async function getHeroSettings() {
  let settings = await SiteSettings.findOne({ key: 'homepage_hero' });
  if (!settings) {
    settings = await SiteSettings.create({
      key: 'homepage_hero',
      heroTitle: 'Crafted by hand, grounded in care.',
      heroSubtitle: 'Curated pure silks, artisanal handloom fabrics, and regal silhouettes.',
      heroBannerUrl: '/assets/hero_banner.jpg',
      heroBadge: 'Grand Festive Edit 2026',
      ctaText: 'Explore Collection',
      whatsappNumber: '919773001771',
    });
  }
  return settings;
}

// GET /api/settings/hero - Public
router.get('/hero', async (req, res) => {
  try {
    const settings = await getHeroSettings();
    res.json({
      success: true,
      hero: {
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroBannerUrl: settings.heroBannerUrl,
        heroBadge: settings.heroBadge,
        ctaText: settings.ctaText,
        whatsappNumber: settings.whatsappNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings/hero - Protected (Admin only)
router.put('/hero', verifyAdmin, async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, heroBannerUrl, heroBadge, ctaText, whatsappNumber } = req.body;
    const settings = await getHeroSettings();

    if (heroTitle !== undefined) settings.heroTitle = heroTitle.trim();
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle.trim();
    if (heroBannerUrl !== undefined) settings.heroBannerUrl = heroBannerUrl.trim();
    if (heroBadge !== undefined) settings.heroBadge = heroBadge.trim();
    if (ctaText !== undefined) settings.ctaText = ctaText.trim();
    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber.trim();

    await settings.save();

    res.json({
      success: true,
      message: 'Homepage hero banner and headings updated successfully!',
      hero: {
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroBannerUrl: settings.heroBannerUrl,
        heroBadge: settings.heroBadge,
        ctaText: settings.ctaText,
        whatsappNumber: settings.whatsappNumber,
      },
    });
  } catch (err) {
    console.error('Update hero settings error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
