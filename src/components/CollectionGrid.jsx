import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CollectionGrid() {
  const { setSelectedCategory } = useShop();

  const collections = [
    {
      title: 'Signature Anarkalis',
      subtitle: 'Graceful silhouettes in royal maroons & pure silk',
      image: '/assets/maroon_anarkali.jpg',
      category: 'Anarkalis',
      tag: 'Bestseller',
    },
    {
      title: 'Kurtas & Sharara Sets',
      subtitle: 'Vibrant emeralds & mustard hues for celebrations',
      image: '/assets/emerald_kurta.jpg',
      category: 'Kurtas & Sets',
      tag: 'Festive Hit',
    },
    {
      title: 'Indo-Western Fusion',
      subtitle: 'Modern capes, bustiers & palazzo trousers',
      image: '/assets/indowestern_cape.jpg',
      category: 'Indo-Western',
      tag: 'Trending',
    },
    {
      title: 'Handcrafted Lehengas',
      subtitle: 'Blush pink georgette with delicate micro-sequins',
      image: '/assets/blush_lehenga.jpg',
      category: 'Lehengas',
      tag: 'Wedding Edit',
    },
    {
      title: 'Organza Sarees',
      subtitle: 'Whisper-soft hand-painted florals with scallop borders',
      image: '/assets/organza_saree.jpg',
      category: 'Sarees',
      tag: 'Artisanal',
    },
  ];

  const handleSelect = (category) => {
    setSelectedCategory(category);
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
            Handpicked For Every Celebration
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.98rem' }}>
            From grand wedding soirees to intimate family gatherings, explore Indian wear crafted to make you look and feel extraordinary.
          </p>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
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
                height: '360px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
                border: '1px solid rgba(107, 29, 47, 0.1)',
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
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span className="badge-gold">{item.tag}</span>
              </div>

              {/* Bottom Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(31, 10, 16, 0.92) 0%, rgba(31, 10, 16, 0.4) 45%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                  color: '#ffffff',
                }}
              >
                <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#faedd9', marginBottom: '0.8rem', opacity: 0.9 }}>
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
                  <span>Explore Outfits</span>
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
          border-color: rgba(212, 175, 55, 0.5);
        }
        .collection-card:hover .collection-card-img {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}
