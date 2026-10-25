import React from 'react';
import { Sparkles, Phone, Truck, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AnnouncementBar() {
  const { setOrderTrackerOpen } = useShop();

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #360712 0%, #6b1d2f 50%, #4a0d1a 100%)',
        color: '#fdfaf2',
        fontSize: '0.8rem',
        padding: '0.45rem 1rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={14} color="#d4af37" />
          <span>
            <strong>Shubh Deepavali Celebration:</strong> Flat <strong>15% OFF</strong> with code <strong style={{ color: '#d4af37', letterSpacing: '0.05em' }}>DIWALI15</strong>
          </span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Truck size={13} color="#e5c378" /> Free Shipping above ₹1999 across India
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <a
            href="https://wa.me/919773001771?text=Hi%20Komal!%20I'm%20browsing%20Sui-Dhaga%20and%20would%20love%20some%20help%20with%20sizing%20and%20styling."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#fdfaf2',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'color 0.2s',
            }}
          >
            <Phone size={13} color="#25D366" />
            <span>+91 97730 01771</span>
          </a>

          <button
            onClick={() => setOrderTrackerOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#d4af37',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: 0,
            }}
          >
            <Clock size={13} />
            <span>Track Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
