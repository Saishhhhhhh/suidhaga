import React, { useState } from 'react';
import { Phone, Mail, MapPin, Heart, Sparkles, Send, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import OfficialWhatsAppIcon from './OfficialWhatsAppIcon';
import { useShop } from '../context/ShopContext';

export default function Footer({ setCurrentView, onOpenCategory, onOpenPolicy, onOpenContact }) {
  const { setSelectedCategory, setOrderTrackerOpen } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#26050e',
        color: '#fdfaf2',
        padding: '4.5rem 0 2rem',
        borderTop: '2px solid rgba(212, 175, 55, 0.4)',
      }}
    >
      <div className="container">
        
        {/* Top 3 Value Props Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={22} color="#d4af37" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>100% Handcrafted Detailing</div>
              <div style={{ fontSize: '0.8rem', color: '#faedd9', opacity: 0.8 }}>Stitched with love & care</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={22} color="#d4af37" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Pan-India Express Shipping</div>
              <div style={{ fontSize: '0.8rem', color: '#faedd9', opacity: 0.8 }}>Free delivery above ₹1999</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RotateCcw size={22} color="#d4af37" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Hassle-Free Exchanges</div>
              <div style={{ fontSize: '0.8rem', color: '#faedd9', opacity: 0.8 }}>7 days easy size exchange</div>
            </div>
          </div>
        </div>

        {/* 4 Columns Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Col 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <img
                src="/assets/logo.webp"
                alt="Sui Dhaga Logo"
                style={{ height: '56px', width: 'auto', filter: 'brightness(1.1) drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}
              />
              <div>
                <span className="font-royal" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.1em' }}>
                  SUI-DHAGA
                </span>
                <div style={{ fontSize: '0.7rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  by Komal
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', lineHeight: 1.65, color: '#e5d7d0', marginBottom: '1.2rem' }}>
              Your destination for affordable Indo-Western and ethnic wear blending timeless Indian tradition with modern style. Every stitch carries love, every design tells a tale of today’s modern woman.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d4af37', fontWeight: 700, fontSize: '0.85rem' }}>
              <Heart size={16} fill="#d4af37" />
              <span>#madewithheart</span>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div>
            <h4
              className="font-display"
              style={{ fontSize: '1.15rem', color: '#d4af37', fontWeight: 700, marginBottom: '1.2rem' }}
            >
              Curated Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              {['Ethnic Wear', 'Travel Ready', 'Shirts', 'Indo-Western'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      if (onOpenCategory) {
                        onOpenCategory(cat);
                      } else {
                        setSelectedCategory(cat);
                        setCurrentView('shop');
                        window.scrollTo({ top: 600, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e5d7d0',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      fontSize: '0.88rem',
                      transition: 'color 0.2s',
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setOrderTrackerOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d4af37',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    fontSize: '0.88rem',
                  }}
                >
                  Track Your Order ➔
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenContact ? onOpenContact() : (window.location.href = '/contact-us')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e5d7d0',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    transition: 'color 0.2s',
                  }}
                  className="footer-link-btn"
                >
                  Contact Us & Atelier Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4
              className="font-display"
              style={{ fontSize: '1.15rem', color: '#d4af37', fontWeight: 700, marginBottom: '1.2rem' }}
            >
              Get in Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.88rem', color: '#e5d7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <OfficialWhatsAppIcon size={16} color="#25D366" />
                <a
                  href="https://wa.me/919773001771"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}
                >
                  +91 97730 01771
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="#d4af37" />
                <a
                  href="mailto:help@connectsuidhaga.com"
                  style={{ color: '#ffffff', textDecoration: 'none' }}
                >
                  help@connectsuidhaga.com
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={16} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Atelier Studio, Vasai – Virar (East), Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4
              className="font-display"
              style={{ fontSize: '1.15rem', color: '#d4af37', fontWeight: 700, marginBottom: '1.2rem' }}
            >
              Join The Sui-Dhaga Family
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#e5d7d0', marginBottom: '1rem', lineHeight: 1.5 }}>
              Be the first to know about secret festive drops, custom bridal consultations, and private founder sales.
            </p>

            {subscribed ? (
              <div style={{ padding: '0.7rem', backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', borderRadius: 'var(--radius-sm)', color: '#4ade80', fontSize: '0.82rem' }}>
                ✨ Thank you for subscribing to Komal's newsletter!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '0.55rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    flexGrow: 1,
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn btn-gold btn-sm" style={{ padding: '0.55rem 0.9rem' }}>
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#c2b3ab',
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>SUI-DHAGA by Komal</strong>. All Rights Reserved. Crafted with care in India.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenPolicy ? onOpenPolicy('privacy') : (window.location.href = '/privacy-policy')}
              style={{ background: 'none', border: 'none', color: '#c2b3ab', cursor: 'pointer', fontSize: '0.78rem', padding: 0 }}
              className="policy-link-btn"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPolicy ? onOpenPolicy('terms') : (window.location.href = '/terms-and-conditions')}
              style={{ background: 'none', border: 'none', color: '#c2b3ab', cursor: 'pointer', fontSize: '0.78rem', padding: 0 }}
              className="policy-link-btn"
            >
              Terms and Conditions
            </button>
            <button
              onClick={() => onOpenPolicy ? onOpenPolicy('returns') : (window.location.href = '/return-policy')}
              style={{ background: 'none', border: 'none', color: '#c2b3ab', cursor: 'pointer', fontSize: '0.78rem', padding: 0 }}
              className="policy-link-btn"
            >
              Return, Exchange & Shipping
            </button>
            <button
              onClick={() => onOpenContact ? onOpenContact() : (window.location.href = '/contact-us')}
              style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', fontSize: '0.78rem', padding: 0, fontWeight: 700 }}
              className="policy-link-btn"
            >
              Contact Us
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .policy-link-btn:hover, .footer-link-btn:hover {
          color: #ffffff !important;
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
}
