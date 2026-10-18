import React from 'react';
import { Sparkles, Scissors, Gem, HeartHandshake, Star, Quote } from 'lucide-react';

export default function WhySuiDhaga() {
  const pillars = [
    {
      icon: Scissors,
      title: 'Needle & Thread Perfection',
      desc: 'Each stitch is done with mindful care, durable French seams, and artisan zardozi needlework.',
    },
    {
      icon: Gem,
      title: 'Luminous Handloom Fabrics',
      desc: 'Pure Chanderi silk, breathable georgette, and featherlight organza sourced from Indian weaving clusters.',
    },
    {
      icon: HeartHandshake,
      title: 'Real Indian Sizing & Custom Fits',
      desc: 'Tailored for Indian body types with generous seam margins for future adjustments.',
    },
    {
      icon: Sparkles,
      title: 'Direct Stylist Assistance',
      desc: 'Chat directly with founder Komal on WhatsApp for color matching and event styling guidance.',
    },
  ];

  const testimonials = [
    {
      name: 'Ananya Deshmukh',
      city: 'Pune',
      outfit: 'Gulrukh Maroon Velvet Gown',
      review: 'I wore the Gulrukh velvet gown for my brother’s reception in Mumbai. The maroon color is so regal and royal! Received endless compliments. The finishing and stitch work are truly boutique quality.',
    },
    {
      name: 'Rituja Sen',
      city: 'Kolkata',
      outfit: 'Roohani Organza Saree',
      review: 'The organza saree is so lightweight and easy to drape. The scalloped embroidery is delicate and looks ten times more expensive than what I paid. Thank you Komal for the lovely packaging!',
    },
    {
      name: 'Meera Patel',
      city: 'Ahmedabad',
      outfit: 'Zeenat Emerald Kurta Set',
      review: 'Fast delivery and perfect fit! The gota patti on the emerald green kurta shines gorgeously under festive lights. Sui Dhaga is my new favorite brand for Indian wear.',
    },
  ];

  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #ede4dc' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
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
            <span>The Sui-Dhaga Promise</span>
          </div>

          <h2
            className="font-display maroon-gradient-text"
            style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '0.8rem' }}
          >
            Why Women Across India Choose Us
          </h2>

          <p style={{ color: 'var(--text-medium)', fontSize: '0.96rem' }}>
            We believe ethnic fashion should feel like an heirloom yet remain accessible to every modern woman.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4.5rem',
          }}
        >
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-luxury"
                style={{
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--ivory-surface)',
                  border: '1px solid var(--border-gold)',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--maroon-800)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    boxShadow: 'var(--shadow-gold)',
                  }}
                >
                  <Icon size={26} color="#d4af37" />
                </div>
                <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--maroon-900)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-medium)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 className="font-display maroon-gradient-text" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Loved by Modern Indian Women
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real reviews from verified buyers</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="card-luxury"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: '4px solid var(--maroon-800)',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#d4af37" color="#d4af37" />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-dark)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  “{t.review}”
                </p>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: 'var(--maroon-900)', fontSize: '0.95rem' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {t.city} • Verified Buyer ({t.outfit})
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
