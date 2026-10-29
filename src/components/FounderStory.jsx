import React from 'react';
import { Heart, Sparkles, Mail } from 'lucide-react';
import OfficialWhatsAppIcon from './OfficialWhatsAppIcon';

export default function FounderStory() {
  return (
    <section id="founder-story" style={{ padding: '5rem 0', backgroundColor: '#fcf8f3', position: 'relative' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Founder Atelier Image */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-elevated)',
                border: '2px solid var(--border-gold)',
              }}
            >
              <img
                src="/assets/founder_komal.jpg"
                alt="Komal - Founder of Sui Dhaga"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Quote Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-1.5rem',
                right: '-1rem',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.4rem',
                boxShadow: 'var(--shadow-medium)',
                maxWidth: '260px',
              }}
              className="founder-floating-pill"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--maroon-800)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Heart size={16} fill="#c23b4b" color="#c23b4b" />
                <span>#madewithheart</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-medium)', marginTop: '0.2rem' }}>
                Every single piece hand-finished with meticulous precision.
              </p>
            </div>
          </div>

          {/* Right: The Brand Journey & Story */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--gold-600)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.8rem',
              }}
            >
              <Sparkles size={15} />
              <span>The Soul of Sui Dhaga</span>
            </div>

            <h2
              className="font-display maroon-gradient-text"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.2rem' }}
            >
              Crafted by hand, <br />
              grounded in care.
            </h2>

            <div
              style={{
                borderLeft: '3px solid var(--gold-500)',
                paddingLeft: '1.25rem',
                margin: '1.5rem 0',
                fontStyle: 'italic',
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'var(--maroon-900)',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                padding: '1rem 1.25rem',
                borderRadius: '0 8px 8px 0',
              }}
            >
              “Sui Dhaga is more than a brand, it’s my story of passion, patience, and pure hard work. Every stitch carries love, every design tells a tale of today’s modern woman — rooted, graceful, and unstoppable.”
            </div>

            <p style={{ color: 'var(--text-medium)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Welcome to <strong>SUI-DHAGA by Komal</strong> — your destination for affordable Indo-Western and ethnic wear blending timeless Indian tradition with modern style. Born from a love for exquisite fabrics, needle craftsmanship, and authentic fits, our collections are created to empower every woman to shine effortlessly.
            </p>

            <div
              className="founder-contact-wrapper"
              style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}
            >
              <div className="founder-signature-box">
                <div className="font-cursive" style={{ fontSize: '2.5rem', color: 'var(--maroon-800)', lineHeight: 1 }}>
                  Komal
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8c6913', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Founder & Creative Director
                </div>
              </div>

              <div className="founder-divider" style={{ height: '40px', width: '1px', backgroundColor: '#ddd' }} />

              <div className="founder-contact-actions" style={{ display: 'flex', gap: '0.8rem' }}>
                <a
                  href="https://wa.me/918767547514?text=Hi%20SuiDhaga%20%2F%20Komal!%20I'd%20love%20to%20know%20more%20about%20Sui-Dhaga%20designs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm founder-contact-btn"
                  title="Chat directly on WhatsApp"
                >
                  <OfficialWhatsAppIcon size={16} color="#25D366" />
                  <span>+91 87675 47514</span>
                </a>

                <a
                  href="mailto:help@connectsuidhaga.com"
                  className="btn btn-outline btn-sm founder-contact-btn"
                  title="Send email"
                >
                  <Mail size={15} color="var(--maroon-800)" />
                  <span>help@connectsuidhaga.com</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .founder-contact-wrapper {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.15rem !important;
            margin-bottom: 1.5rem !important;
          }
          .founder-divider {
            display: none !important;
          }
          .founder-contact-actions {
            width: 100% !important;
            flex-direction: column !important;
            gap: 0.65rem !important;
          }
          .founder-contact-btn {
            width: 100% !important;
            height: 42px !important;
            border-radius: 8px !important;
            font-size: 0.82rem !important;
            font-weight: 600 !important;
            white-space: nowrap !important;
            justify-content: center !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </section>
  );
}
