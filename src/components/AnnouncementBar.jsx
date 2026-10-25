import React from 'react';
import { Phone, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AnnouncementBar() {
  const { setOrderTrackerOpen } = useShop();

  return (
    <div
      style={{
        backgroundColor: '#26050e',
        color: '#fdfaf2',
        fontSize: '0.74rem',
        padding: '0.4rem 1.5rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        letterSpacing: '0.04em',
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
        {/* Left: Clean Festive Message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🪔</span>
          <span>
            Shubh Deepavali Offer: Use code <strong style={{ color: '#ffd700', letterSpacing: '0.08em' }}>DIWALI15</strong> for 15% Off • Complimentary Shipping across India
          </span>
        </div>

        {/* Right: Clean WhatsApp & Track Order */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://wa.me/919773001771?text=Hi%20Komal!%20I'm%20browsing%20Sui-Dhaga%20and%20would%20love%20some%20guidance."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#fdfaf2',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.74rem',
              opacity: 0.9,
              transition: 'opacity 0.2s',
            }}
          >
            <Phone size={12} color="#25D366" />
            <span>+91 97730 01771</span>
          </a>

          <button
            onClick={() => setOrderTrackerOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffd700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              padding: 0,
            }}
          >
            <Clock size={12} />
            <span>Track Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
