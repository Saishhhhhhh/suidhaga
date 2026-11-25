import React from 'react';
import { Phone, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AnnouncementBar() {
  const { setOrderTrackerOpen } = useShop();

  const handleBannerClick = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const messageText =
    'Black Friday Deals: Up to 40% Off Across Shirts, Ethnic Wear & Indo-Western Outfits • Complimentary Shipping Across India';

  return (
    <div
      style={{
        backgroundColor: '#26050e',
        color: '#fdfaf2',
        fontSize: '0.74rem',
        padding: '0.35rem 1rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        letterSpacing: '0.03em',
        overflow: 'hidden',
        width: '100%',
      }}
      className="top-announcement-bar"
    >
      <div
        className="announcement-bar-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          width: '100%',
        }}
      >
        {/* Left/Center: Continuous Moving Marquee Ticker */}
        <div
          className="announcement-ticker-wrap"
          onClick={handleBannerClick}
          title="Click to explore Black Friday Deals"
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div
            className="announcement-ticker-track"
            style={{
              display: 'inline-flex',
              width: 'max-content',
              whiteSpace: 'nowrap',
              animation: 'suidhagaMarquee 20s linear infinite',
              WebkitAnimation: 'suidhagaMarquee 20s linear infinite',
            }}
          >
            {/* Group 1 */}
            <div className="ticker-group" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{messageText}</span>
              </span>
              <span className="ticker-separator">✦</span>
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{messageText}</span>
              </span>
              <span className="ticker-separator">✦</span>
            </div>

            {/* Group 2 (Duplicate for seamless loop) */}
            <div className="ticker-group" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{messageText}</span>
              </span>
              <span className="ticker-separator">✦</span>
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{messageText}</span>
              </span>
              <span className="ticker-separator">✦</span>
            </div>
          </div>
        </div>

        {/* Right: Clean WhatsApp & Track Order */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexShrink: 0,
            zIndex: 2,
            background: '#26050e',
            paddingLeft: '0.5rem',
          }}
          className="announcement-right"
        >
          <a
            href="https://wa.me/918767547517?text=Hi%20SuiDhaga%20Team!%20I'm%20browsing%20the%20Sui-Dhaga%20collection%20and%20would%20love%20styling%20guidance."
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
            <span>+91 87675 47517</span>
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
            title="Track your order status"
          >
            <Clock size={11} />
            <span>Track Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
