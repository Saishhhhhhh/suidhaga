import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CollectionGrid({ onOpenCategory }) {
  const { setSelectedCategory } = useShop();

  const collections = [
    {
      title: 'Ethnic Wear',
      subtitle: 'Timeless grace crafted in rich silks and handloom weaves',
      image: '/assets/ethenic.webp',
      category: 'Ethnic Wear',
      tag: 'Heritage Edit',
    },
    {
      title: 'Travel Ready',
      subtitle: 'Light. Breezy. Effortless. Your perfect travel companion',
      image: '/assets/travel.webp',
      category: 'Travel Ready',
      tag: 'Resort & Travel',
    },
    {
      title: 'Shirts',
      subtitle: 'Crisp hand-finished cottons and embroidered motifs',
      image: '/assets/shirts.webp',
      category: 'Shirts',
      tag: 'Everyday Chic',
    },
    {
      title: 'Indo-Western',
      subtitle: 'Contemporary fusion cuts blending tradition with modern flair',
      image: '/assets/indowest.webp',
      category: 'Indo-Western',
      tag: 'Modern Fusion',
    },
  ];

  const handleSelect = (category) => {
    setSelectedCategory(category);
    if (onOpenCategory) {
      onOpenCategory(category);
    } else {
      const el = document.getElementById('collection-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '4.5rem 0 2.5rem', backgroundColor: '#fcf9f4' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--gold-600)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={14} />
            <span>Curated Silhouettes</span>
          </div>
          <h2
            className="font-display maroon-gradient-text"
            style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '0.8rem' }}
          >
            Explore Our 4 Signature Collections
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.98rem' }}>
            Handcrafted with love for every mood and occasion — from heritage celebrations to effortless travel and modern chic.
          </p>
        </div>

        {/* 4 Collections Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {collections.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item.category)}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                height: '460px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
                border: '1.5px solid rgba(107, 29, 47, 0.12)',
                transition: 'all var(--transition-smooth)',
              }}
              className="collection-card"
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="collection-card-img"
              />

              {/* Tag pill */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 3 }}>
                <span className="badge-gold">{item.tag}</span>
              </div>

              {/* Bottom Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(31, 10, 16, 0.92) 0%, rgba(31, 10, 16, 0.35) 45%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                  color: '#ffffff',
                  zIndex: 2,
                }}
              >
                <h3 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#faedd9', marginBottom: '0.8rem', opacity: 0.95 }}>
                  {item.subtitle}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#d4af37',
                  }}
                >
                  <span>Explore {item.title}</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .collection-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-medium);
          border-color: rgba(212, 175, 55, 0.6);
        }
        .collection-card:hover .collection-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
