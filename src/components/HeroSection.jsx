import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import OfficialWhatsAppIcon from './OfficialWhatsAppIcon';
import { useShop } from '../context/ShopContext';

export default function HeroSection() {
  const { setSelectedCategory } = useShop();

  const [heroSettings, setHeroSettings] = useState({
    heroTitle: 'Crafted by hand, grounded in care.',
    heroSubtitle: 'Pure handloom silks, intricate zardozi needlework, and timeless luxury silhouettes curated for your special celebrations.',
    heroBannerUrl: '/assets/hero_banner.jpg',
    heroBadge: 'Grand Festive Edit 2026',
    ctaText: 'Explore Collection',
    whatsappNumber: '919773001771',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchHero = async () => {
      try {
        const res = await fetch('/api/settings/hero');
        const data = await res.json();
        if (isMounted && data.success && data.hero) {
          setHeroSettings((prev) => ({
            ...prev,
            ...data.hero,
          }));
        }
      } catch (err) {
        console.warn('Hero settings load notice:', err.message);
      }
    };
    fetchHero();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToProducts = () => {
    setSelectedCategory('All');
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const bannerImg = heroSettings.heroBannerUrl || '/assets/hero_banner.jpg';
  const cleanPhone = (heroSettings.whatsappNumber || '919773001771').replace(/\D/g, '');
  const bannerPos = heroSettings.bannerPosition || 'center center';

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
        backgroundColor: '#1c080e',
      }}
      className="hero-section-luxury"
    >
      {/* Background Banner Image with Full Cover & Precise Positioning */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <img
          src={bannerImg}
          alt="Sui Dhaga Hero Banner"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: bannerPos,
            display: 'block',
          }}
          className="hero-banner-image"
        />
        {/* Soft elegant gradient overlay to keep text readable without cutting the banner */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(28, 8, 14, 0.90) 0%, rgba(28, 8, 14, 0.65) 45%, rgba(28, 8, 14, 0.20) 100%)',
          }}
          className="hero-gradient-overlay"
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4.5rem 1.5rem' }}>

        <div style={{ maxWidth: '680px' }} className="hero-content-box">
          
          {/* Badge */}
          {heroSettings.heroBadge && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--gold-400)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                backdropFilter: 'blur(4px)',
              }}
              className="hero-badge"
            >
              <Sparkles size={14} color="#d4af37" />
              <span>{heroSettings.heroBadge}</span>
            </div>
          )}

          {/* Main Title - Clean & Grand */}
          <h1
            className="font-display hero-title-text"
            style={{
              fontSize: 'clamp(2.2rem, 5.2vw, 4.2rem)',
              fontWeight: 700,
              lineHeight: 1.18,
              marginBottom: '1.25rem',
              color: '#ffffff',
              textShadow: '0 4px 25px rgba(0,0,0,0.5)',
            }}
          >
            {heroSettings.heroTitle}
          </h1>

          {/* Subtitle */}
          {heroSettings.heroSubtitle && (
            <p
              className="hero-subtitle-text"
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                color: '#f3ece7',
                lineHeight: 1.6,
                marginBottom: '2.25rem',
                maxWidth: '560px',
                textShadow: '0 2px 10px rgba(0,0,0,0.4)',
              }}
            >
              {heroSettings.heroSubtitle}
            </p>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="hero-btn-group">
            <button onClick={scrollToProducts} className="btn btn-gold btn-lg hero-cta-btn">
              <span>{heroSettings.ctaText || 'Explore Collection'}</span>
              <ArrowRight size={18} />
            </button>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20Komal!%20I'm%20interested%20in%20customizing%20an%20outfit%20from%20Sui-Dhaga.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-gold btn-lg hero-wa-btn"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <OfficialWhatsAppIcon size={18} color="#25D366" />
              <span>Talk to Komal</span>
            </a>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-section-luxury {
            min-height: 75vh !important;
            display: flex !important;
            align-items: flex-end !important;
            padding-bottom: 2rem !important;
          }
          .hero-gradient-overlay {
            background: linear-gradient(
              to bottom,
              rgba(22, 6, 12, 0.45) 0%,
              rgba(22, 6, 12, 0.25) 30%,
              rgba(22, 6, 12, 0.65) 60%,
              rgba(22, 6, 12, 0.92) 100%
            ) !important;
          }
          .hero-banner-image {
            object-position: center top !important;
          }
          .hero-content-box {
            padding: 0 !important;
          }
          .hero-badge {
            margin-bottom: 0.65rem !important;
            padding: 0.22rem 0.65rem !important;
            font-size: 0.7rem !important;
          }
          .hero-title-text {
            font-size: clamp(1.75rem, 6.8vw, 2.25rem) !important;
            line-height: 1.16 !important;
            margin-bottom: 0.55rem !important;
            text-shadow: 0 3px 20px rgba(0,0,0,0.85) !important;
          }
          .hero-subtitle-text {
            font-size: 0.84rem !important;
            line-height: 1.4 !important;
            margin-bottom: 1.15rem !important;
            text-shadow: 0 2px 10px rgba(0,0,0,0.7) !important;
            max-width: 95% !important;
          }
          .hero-btn-group {
            flex-direction: row !important;
            width: 100% !important;
            gap: 0.65rem !important;
          }
          .hero-btn-group .btn {
            flex: 1 1 0 !important;
            width: auto !important;
            height: 42px !important;
            padding: 0 0.75rem !important;
            font-size: 0.8rem !important;
            font-weight: 700 !important;
            border-radius: 8px !important;
            white-space: nowrap !important;
            justify-content: center !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
          }
          .hero-btn-group .btn span {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
        }
      `}</style>
    </section>
  );
}

