import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
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
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(to right, rgba(31, 10, 16, 0.9) 0%, rgba(54, 7, 18, 0.72) 48%, rgba(54, 7, 18, 0.25) 100%), url('/assets/hero_banner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        color: '#ffffff',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '640px' }}>
          
          {/* Main Title - Clean & Grand */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.6rem, 5.8vw, 4.4rem)',
              fontWeight: 700,
              lineHeight: 1.16,
              marginBottom: '2.5rem',
              color: '#ffffff',
              textShadow: '0 4px 25px rgba(0,0,0,0.5)',
            }}
          >
            Crafted by hand, <br />
            <span className="gold-gradient-text">grounded in care.</span>
          </h1>

          {/* Action Buttons Only */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
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

        </div>
      </div>
    </section>
  );
}
