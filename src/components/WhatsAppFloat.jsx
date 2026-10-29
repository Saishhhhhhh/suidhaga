import React from 'react';
import OfficialWhatsAppIcon from './OfficialWhatsAppIcon';

export default function WhatsAppFloat() {
  const whatsappNumber = '918767547514';
  const defaultMessage = encodeURIComponent(
    "Hi SuiDhaga / Komal! I'm browsing the Sui-Dhaga collection and would love styling guidance on your Indian ethnic and Indo-Western outfits."
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
      }}
      className="whatsapp-float-container"
    >
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: '#25D366',
          color: '#ffffff',
          borderRadius: 'var(--radius-full)',
          padding: '0.75rem 1.25rem',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.88rem',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          animation: 'pulseGlow 2.5s infinite',
        }}
        className="whatsapp-float-btn"
        title="Chat with SuiDhaga on WhatsApp"
      >
        <OfficialWhatsAppIcon size={24} color="#ffffff" />
        <span className="whatsapp-text">Chat with Us</span>
      </a>

      <style>{`
        .whatsapp-float-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.6);
        }
        @media (max-width: 600px) {
          .whatsapp-float-container {
            bottom: 1.25rem !important;
            right: 1.25rem !important;
          }
          .whatsapp-text {
            display: none !important;
          }
          .whatsapp-float-btn {
            width: 48px !important;
            height: 48px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            justify-content: center !important;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5) !important;
          }
        }
      `}</style>
    </div>
  );
}
