import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const whatsappNumber = '919773001771';
  const defaultMessage = encodeURIComponent(
    "Hi Komal! I'm browsing the Sui-Dhaga collection and would love styling guidance on your Indian ethnic and Indo-Western outfits."
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 850,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
      }}
    >
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
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
      >
        <MessageCircle size={22} fill="#ffffff" color="#25D366" />
        <span className="whatsapp-text">Chat with Komal</span>
      </a>

      <style>{`
        .whatsapp-float-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.6);
        }
        @media (max-width: 600px) {
          .whatsapp-text {
            display: none;
          }
          .whatsapp-float-btn {
            padding: 0.8rem;
            border-radius: 50%;
          }
        }
      `}</style>
    </div>
  );
}
