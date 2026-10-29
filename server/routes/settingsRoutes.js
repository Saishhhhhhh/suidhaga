const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const SiteSettings = require('../models/SiteSettings');

const DEFAULT_HERO = {
  heroTitle: 'Crafted by hand, grounded in care.',
  heroSubtitle: 'Curated pure silks, artisanal handloom fabrics, and regal silhouettes.',
  heroBannerUrl: '/assets/hero_banner.jpg',
  heroBadge: 'Grand Festive Edit 2026',
  ctaText: 'Explore Collection',
  whatsappNumber: '918767547514',
  bannerPosition: 'center center',
};

// Helper to get or create hero settings
async function getHeroSettings() {
  try {
    let settings = await SiteSettings.findOne({ key: 'homepage_hero' });
    if (!settings) {
      settings = await SiteSettings.create({
        key: 'homepage_hero',
        ...DEFAULT_HERO,
      });
    }
    return settings;
  } catch (err) {
    console.warn('DB read notice in hero settings, using default:', err.message);
    return DEFAULT_HERO;
  }
}

// GET /api/settings/hero - Public
router.get('/hero', async (req, res) => {
  try {
    const settings = await getHeroSettings();
    res.json({
      success: true,
      hero: {
        heroTitle: settings.heroTitle || DEFAULT_HERO.heroTitle,
        heroSubtitle: settings.heroSubtitle || DEFAULT_HERO.heroSubtitle,
        heroBannerUrl: settings.heroBannerUrl || DEFAULT_HERO.heroBannerUrl,
        heroBadge: settings.heroBadge || DEFAULT_HERO.heroBadge,
        ctaText: settings.ctaText || DEFAULT_HERO.ctaText,
        whatsappNumber: settings.whatsappNumber || DEFAULT_HERO.whatsappNumber,
        bannerPosition: settings.bannerPosition || DEFAULT_HERO.bannerPosition,
      },
    });
  } catch (err) {
    res.json({ success: true, hero: DEFAULT_HERO });
  }
});

// PUT /api/settings/hero - Protected (Admin only)
router.put('/hero', verifyAdmin, async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, heroBannerUrl, heroBadge, ctaText, whatsappNumber, bannerPosition } = req.body;
    let settings = await SiteSettings.findOne({ key: 'homepage_hero' });
    if (!settings) {
      settings = new SiteSettings({ key: 'homepage_hero', ...DEFAULT_HERO });
    }

    if (heroTitle !== undefined) settings.heroTitle = heroTitle.trim();
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle.trim();
    if (heroBannerUrl !== undefined) settings.heroBannerUrl = heroBannerUrl.trim();
    if (heroBadge !== undefined) settings.heroBadge = heroBadge.trim();
    if (ctaText !== undefined) settings.ctaText = ctaText.trim();
    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber.trim();
    if (bannerPosition !== undefined) settings.bannerPosition = bannerPosition.trim();

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
        bannerPosition: settings.bannerPosition,
      },
    });
  } catch (err) {
    console.error('Update hero settings error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
