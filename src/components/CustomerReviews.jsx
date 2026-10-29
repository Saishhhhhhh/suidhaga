import React, { useState } from 'react';
import { Star, ShieldCheck, Heart, Sparkles, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Ananya Roy',
    city: 'Mumbai, Maharashtra',
    outfit: 'Royal Zardozi Anarkali Suit',
    rating: 5,
    tag: 'Verified Diwali Buyer',
    image: '/assets/customer_review_1.jpg',
    comment:
      'I wore the Royal Maroon Anarkali to our family Diwali celebration and literally everyone asked where I got it! The drape of the pure silk, the intricate gold zardozi neckline, and the tailored fit were beyond perfection. Sui-Dhaga made me feel so regal yet completely comfortable all evening.',
    date: 'October 2026',
  },
  {
    id: 2,
    name: 'Pooja Deshmukh',
    city: 'Pune, Maharashtra',
    outfit: 'Mustard Silk Sharara Set',
    rating: 5,
    tag: 'Verified Sangeet Buyer',
    image: '/assets/customer_review_2.jpg',
    comment:
      'Finding festive ethnic wear that feels light, breathable and looks this grand is so rare! The mustard sharara set has stunning needlework and the color was vibrant in every single photo. Plus, the team on WhatsApp guided me on exact sizing so it required zero alterations.',
    date: 'September 2026',
  },
  {
    id: 3,
    name: 'Meera Kapoor',
    city: 'New Delhi',
    outfit: 'Blush Pink Embroidered Lehenga',
    rating: 5,
    tag: 'Verified Reception Buyer',
    image: '/assets/customer_review_3.jpg',
    comment:
      'The craftsmanship is sublime! Every stitch carries genuine love and artisan care. The fabric is ultra soft, premium, and falls gracefully. It arrived securely packed at my Delhi doorstep in just 4 days. Absolutely in love with this brand!',
    date: 'October 2026',
  },
  {
    id: 4,
    name: 'Ritu Singhania',
    city: 'Ahmedabad, Gujarat',
    outfit: 'Indo-Western Embroidered Cape Set',
    rating: 5,
    tag: 'Verified Festive Buyer',
    image: '/assets/customer_review_4.jpg',
    comment:
      'I needed a chic Indo-Western outfit for a destination cocktail event and this cape set exceeded every expectation. Modern silhouette, delicate gold threadwork, and pure luxury aesthetic. Sui-Dhaga has earned a lifelong customer!',
    date: 'August 2026',
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <section
      style={{
        backgroundColor: '#faf6f2',
        padding: '5rem 0 5.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
      }}
      className="customer-reviews-section"
    >
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--gold-600)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}
          >
            <Sparkles size={14} color="#d4af37" />
            <span>Loved by 10,000+ Women Across India</span>
          </div>

          <h2
            className="font-display maroon-gradient-text"
            style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.75rem' }}
          >
            Real Stories. Authentic Fits.
          </h2>

          <p style={{ color: 'var(--text-medium)', fontSize: '0.96rem', lineHeight: 1.65 }}>
            See how our handcrafted festive kurtas, royal anarkalis, and modern Indo-Western silhouettes bring effortless grace to women across India.
          </p>
        </div>

        {/* Reviews Grid (Desktop 2x2 or 4 Cards, Mobile Swiper) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3.5rem',
          }}
          className="reviews-cards-grid"
        >
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="card-luxury"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.75rem 1.5rem',
                border: '1px solid #eee4db',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 8px 25px rgba(0,0,0,0.03)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              {/* Top Quote Icon */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  opacity: 0.12,
                  color: 'var(--maroon-900)',
                }}
              >
                <Quote size={40} />
              </div>

              {/* Customer Photo & Bio */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <img
                  src={rev.image}
                  alt={rev.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #d4af37',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)',
                    flexShrink: 0,
                  }}
                  loading="lazy"
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--maroon-900)', fontWeight: 700 }}>
                    {rev.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {rev.city}
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.7rem',
                      color: '#15803d',
                      backgroundColor: '#dcfce7',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      marginTop: '4px',
                    }}
                  >
                    <ShieldCheck size={11} />
                    <span>{rev.tag}</span>
                  </div>
                </div>
              </div>

              {/* Outfit Purchased Tag */}
              <div
                style={{
                  backgroundColor: '#fbf7f4',
                  border: '1px dashed #eadcd0',
                  borderRadius: '6px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.76rem',
                  color: '#8c6913',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  letterSpacing: '0.02em',
                }}
              >
                ✨ Wore: <strong>{rev.outfit}</strong>
              </div>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: '3px', marginBottom: '0.85rem' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="#d4af37" color="#d4af37" />
                ))}
              </div>

              {/* Review Comment */}
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#3e2d30',
                  lineHeight: 1.65,
                  margin: 0,
                  flexGrow: 1,
                  fontStyle: 'italic',
                }}
              >
                “{rev.comment}”
              </p>

              {/* Bottom Date */}
              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f3ece6',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Verified Purchase</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Row */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #eedfd4',
            padding: '1.5rem 2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            textAlign: 'center',
          }}
          className="trust-badges-bar"
        >
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--maroon-900)' }}>4.9 / 5.0</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '4px 0' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#d4af37" color="#d4af37" />
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Over 1,480+ Happy Customers</div>
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--maroon-900)' }}>100% Handcrafted</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Pure Silks & Authentic Handloom Blends
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--maroon-900)' }}>Pan-India Delivery</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Delivered to your doorstep within 7 days
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--maroon-900)' }}>7-Day Easy Exchange</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Hassle-free size replacement support
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .reviews-cards-grid .card-luxury:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(107, 29, 47, 0.08) !important;
          border-color: #d4af37 !important;
        }
        @media (max-width: 640px) {
          .customer-reviews-section {
            padding: 3.5rem 0 4rem !important;
          }
          .trust-badges-bar {
            padding: 1.25rem 1rem !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
