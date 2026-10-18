import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, Award, Scissors, HeartHandshake, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeroSection() {
  const { setSelectedCategory } = useShop();

  const scrollToProducts = () => {
    setSelectedCategory('All');
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(to right, rgba(31, 10, 16, 0.92) 0%, rgba(54, 7, 18, 0.78) 50%, rgba(54, 7, 18, 0.4) 100%), url('/assets/hero_banner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        color: '#ffffff',
        overflow: 'hidden',
        borderBottom: '2px solid rgba(212, 175, 55, 0.4)',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '680px' }}>
          
          {/* Top Brand Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 1rem',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={16} color="#d4af37" />
            <span
              style={{
                color: '#fdfaf2',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Festive Edit 2026 • #madewithheart
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: '1.2rem',
              color: '#ffffff',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Crafted by hand, <br />
            <span className="gold-gradient-text">grounded in care.</span>
          </h1>

          {/* Tagline & Story excerpt */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.6,
              color: '#faedd9',
              marginBottom: '2rem',
              maxWidth: '600px',
              textShadow: '0 2px 10px rgba(0,0,0,0.4)',
            }}
          >
            Every stitch carries love, every design tells a tale of today’s modern woman —
            rooted, graceful, and unstoppable. Blending timeless Indian tradition with effortless modern style.
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button onClick={scrollToProducts} className="btn btn-gold btn-lg">
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="https://wa.me/919773001771?text=Hi%20Komal!%20I'm%20interested%20in%20customizing%20an%20outfit%20from%20Sui-Dhaga."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-gold btn-lg"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <MessageCircle size={18} color="#25D366" />
              <span>Talk to Komal (+91 97730 01771)</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Scissors size={20} color="#d4af37" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Handcrafted</div>
                <div style={{ fontSize: '0.72rem', color: '#e5c378' }}>Artisanal needlework</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HeartHandshake size={20} color="#d4af37" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Affordable Luxury</div>
                <div style={{ fontSize: '0.72rem', color: '#e5c378' }}>Fair designer pricing</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Truck size={20} color="#d4af37" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Pan-India Express</div>
                <div style={{ fontSize: '0.72rem', color: '#e5c378' }}>Free above ₹1999</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
