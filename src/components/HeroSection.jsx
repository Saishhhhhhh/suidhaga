import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
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

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(to right, rgba(31, 10, 16, 0.92) 0%, rgba(54, 7, 18, 0.78) 50%, rgba(54, 7, 18, 0.35) 100%), url('${bannerImg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        color: '#ffffff',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
      }}
      className="hero-section-luxury"
    >
      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4.5rem 1.5rem' }}>
        <div style={{ maxWidth: '680px' }}>
          
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
            >
              <Sparkles size={14} color="#d4af37" />
              <span>{heroSettings.heroBadge}</span>
            </div>
          )}

          {/* Main Title - Clean & Grand */}
          <h1
            className="font-display"
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
            <button onClick={scrollToProducts} className="btn btn-gold btn-lg">
              <span>{heroSettings.ctaText || 'Explore Collection'}</span>
              <ArrowRight size={18} />
            </button>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20Komal!%20I'm%20interested%20in%20customizing%20an%20outfit%20from%20Sui-Dhaga.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-gold btn-lg"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <MessageCircle size={18} color="#25D366" />
              <span>Talk to Komal</span>
            </a>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-section-luxury {
            min-height: 70vh !important;
            background-position: center center !important;
          }
          .hero-btn-group {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-btn-group .btn {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
