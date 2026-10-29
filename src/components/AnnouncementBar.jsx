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
        padding: '0.35rem 1.25rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        letterSpacing: '0.03em',
      }}
      className="top-announcement-bar"
    >
      <div
        className="container announcement-bar-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        {/* Left: Clean Festive Message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }} className="announcement-msg">
          <span style={{ fontSize: '0.9rem' }}>🪔</span>
          <span className="desktop-announcement-text">
            Shubh Deepavali Offer: Use code <strong style={{ color: '#ffd700', letterSpacing: '0.08em' }}>DIWALI15</strong> for 15% Off • Complimentary Shipping across India
          </span>
          <span className="mobile-announcement-text">
            Festive Offer: 15% Off (Code: <strong style={{ color: '#ffd700' }}>DIWALI15</strong>) • Free Shipping
          </span>
        </div>

        {/* Right: Clean WhatsApp & Track Order */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }} className="announcement-right">
          <a
            href="https://wa.me/918767547514?text=Hi%20SuiDhaga%20%2F%20Komal!%20I'm%20browsing%20the%20Sui-Dhaga%20collection%20and%20would%20love%20styling%20guidance."
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
            className="announcement-phone"
          >
            <Phone size={12} color="#25D366" />
            <span>+91 87675 47514</span>
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
              gap: '0.25rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <Clock size={11} />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      <style>{`
        .mobile-announcement-text {
          display: none;
        }
        @media (max-width: 768px) {
          .top-announcement-bar {
            padding: 0.28rem 0.5rem !important;
          }
          .announcement-bar-container {
            justify-content: space-between !important;
          }
          .desktop-announcement-text {
            display: none !important;
          }
          .mobile-announcement-text {
            display: inline !important;
            font-size: 0.68rem !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .announcement-phone {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

