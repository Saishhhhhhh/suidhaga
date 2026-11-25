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

  const announcementMessage =
    'Black Friday Deals: Up to 40% Off Across Shirts, Ethnic Wear & Indo-Western Outfits • Complimentary Shipping Across India';

  return (
    <div
      style={{
        backgroundColor: '#26050e',
        color: '#fdfaf2',
        fontSize: '0.74rem',
        padding: '0.35rem 1.25rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        letterSpacing: '0.03em',
        overflow: 'hidden',
      }}
      className="top-announcement-bar"
    >
      <div
        className="container announcement-bar-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          maxWidth: '100%',
          padding: '0 0.5rem',
        }}
      >
        {/* Left/Center: Continuous Moving Marquee Ticker */}
        <div
          className="announcement-ticker-wrap"
          onClick={handleBannerClick}
          title="Click to explore Black Friday Deals"
        >
          <div className="announcement-ticker-track">
            {/* Primary group */}
            <div className="ticker-group">
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{announcementMessage}</span>
              </span>
              <span className="ticker-separator">✦</span>
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{announcementMessage}</span>
              </span>
              <span className="ticker-separator">✦</span>
            </div>

            {/* Cloned group for seamless 0% to -50% infinite loop */}
            <div className="ticker-group" aria-hidden="true">
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{announcementMessage}</span>
              </span>
              <span className="ticker-separator">✦</span>
              <span className="ticker-item">
                <span className="ticker-sparkle">✨</span>
                <span>{announcementMessage}</span>
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
            paddingLeft: '0.75rem',
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

      <style>{`
        .announcement-ticker-wrap {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          cursor: pointer;
          mask-image: linear-gradient(90deg, transparent 0%, #000 15px, #000 calc(100% - 15px), transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 15px, #000 calc(100% - 15px), transparent 100%);
        }

        .announcement-ticker-track {
          display: flex;
          width: max-content;
          white-space: nowrap;
          animation: announcementTickerScroll 30s linear infinite;
          will-change: transform;
        }

        .announcement-ticker-wrap:hover .announcement-ticker-track {
          animation-play-state: paused;
        }

        @keyframes announcementTickerScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .ticker-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0 0.9rem;
          font-weight: 500;
          color: #fdfaf2;
          letter-spacing: 0.03em;
          transition: color 0.2s;
        }

        .announcement-ticker-wrap:hover .ticker-item {
          color: #fff;
        }

        .ticker-sparkle {
          font-size: 0.85rem;
          line-height: 1;
        }

        .ticker-separator {
          color: #d4af37;
          font-size: 0.62rem;
          opacity: 0.75;
          padding: 0 0.5rem;
        }

        @media (max-width: 768px) {
          .top-announcement-bar {
            padding: 0.28rem 0.5rem !important;
          }
          .announcement-bar-container {
            gap: 0.4rem !important;
            padding: 0 !important;
          }
          .announcement-phone {
            display: none !important;
          }
          .announcement-right {
            padding-left: 0.4rem !important;
          }
          .ticker-item {
            font-size: 0.72rem !important;
            padding: 0 0.5rem !important;
          }
          .announcement-ticker-track {
            animation-duration: 25s !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-ticker-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
