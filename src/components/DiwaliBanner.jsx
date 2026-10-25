import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function DiwaliBanner() {
  const { applyCoupon, setSelectedCategory } = useShop();
  const [copied, setCopied] = useState(false);

  const handleApplyDiwaliCode = () => {
    applyCoupon('DIWALI15');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExplore = () => {
    setSelectedCategory('Ethnic Wear');
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '2.5rem 0 1.5rem', backgroundColor: 'var(--ivory-base)' }}>
      <div className="container">
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundImage: `linear-gradient(rgba(35, 6, 13, 0.72), rgba(35, 6, 13, 0.72)), url('/assets/diwali_banner.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 16px 40px -10px rgba(54, 7, 18, 0.3), 0 0 35px rgba(212, 175, 55, 0.12)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: '#ffffff',
          }}
          className="diwali-minimal-banner"
        >
          {/* Subtle Decorative Golden Border Frame inside */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1px solid rgba(212, 175, 55, 0.28)',
              borderRadius: 'calc(var(--radius-lg) - 8px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
            
            {/* Minimal Festive Header Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#e5c378',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: '0.85rem',
              }}
            >
              <Sparkles size={13} color="#d4af37" />
              <span>Shubh Deepavali Festive Offer</span>
            </div>

            {/* Clean Editorial Heading */}
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(1.9rem, 4vw, 2.75rem)',
                fontWeight: 700,
                lineHeight: 1.22,
                color: '#ffffff',
                marginBottom: '1.5rem',
                textShadow: '0 2px 18px rgba(0,0,0,0.5)',
              }}
            >
              Illuminate Your Celebrations in <br />
              <span className="gold-gradient-text">Pure Handcrafted Grace</span>
            </h2>

            {/* Minimal Offer Row: Code Pill & Clean Button */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Clean Coupon Pill */}
              <div
                onClick={handleApplyDiwaliCode}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px dashed rgba(212, 175, 55, 0.75)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.65rem 1.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  userSelect: 'none',
                }}
                className="diwali-coupon-pill"
                title="Click to apply DIWALI15 coupon"
              >
                <span style={{ fontSize: '0.85rem', color: '#fdfaf2' }}>
                  Flat <strong>15% OFF</strong> with Code:
                </span>
                <span
                  style={{
                    color: '#ffd700',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    fontSize: '1rem',
                  }}
                >
                  DIWALI15
                </span>
                {copied ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: '#4ade80',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    <Check size={14} /> Applied!
                  </span>
                ) : (
                  <Copy size={15} color="#ffd700" />
                )}
              </div>

              {/* Single Clean CTA */}
              <button
                onClick={handleExplore}
                className="btn btn-gold"
                style={{
                  padding: '0.7rem 1.75rem',
                  fontSize: '0.92rem',
                }}
              >
                <span>Shop Festive Specials</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .diwali-coupon-pill:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
          border-color: #ffd700 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.25);
        }
      `}</style>
    </section>
  );
}
