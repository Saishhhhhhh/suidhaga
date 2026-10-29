import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowLeft, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import OfficialWhatsAppIcon from '../components/OfficialWhatsAppIcon';

export default function ContactPage({ onBackToHome }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Custom Fit / Sizing',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'Custom Fit / Sizing',
          message: '',
        });
      } else {
        setErrorMsg(data.message || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to the server. Please check your internet or chat directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fcf8f3', minHeight: '85vh', padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={onBackToHome}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Store</span>
          </button>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span onClick={onBackToHome} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Home</span>
            {' / '}
            <span style={{ color: 'var(--maroon-900)', fontWeight: 600 }}>Contact Us</span>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
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
            <span>Connect with Sui Dhaga Team</span>
          </div>

          <h1 className="font-display maroon-gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.8rem' }}>
            We'd Love to Hear From You
          </h1>

          <p style={{ color: 'var(--text-medium)', fontSize: '0.96rem', lineHeight: 1.65 }}>
            Have questions about custom sizing, bridal consultations, fabric details, or order tracking? Reach out directly to our atelier team.
          </p>
        </div>

        {/* Grid: 2 Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Direct Atelier Information */}
          <div
            className="card-luxury"
            style={{
              backgroundColor: '#26050e',
              color: '#ffffff',
              padding: '2.75rem 2.25rem',
              borderRadius: '16px',
              border: '1.5px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 12px 35px rgba(38, 5, 14, 0.15)',
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <span className="font-royal" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em' }}>
                SUI-DHAGA
              </span>
              <div style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>
                by Komal • Atelier Studio
              </div>
            </div>

            <p style={{ color: '#e5d7d0', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '2.25rem' }}>
              Every stitch carries love, every design tells a tale of today’s modern woman. For immediate styling guidance, fabric swatches, or urgent dispatch requests, we encourage you to chat directly on WhatsApp.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', fontSize: '0.92rem' }}>
              {/* WhatsApp & Call */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <OfficialWhatsAppIcon size={20} color="#25D366" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    WhatsApp & Phone
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                    <a href="https://wa.me/918767547514" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>
                      +91 87675 47514
                    </a>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#bfae9c', marginTop: '2px' }}>Instant response during business hours</div>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={18} color="#d4af37" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Support Email
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>
                    <a href="mailto:help@connectsuidhaga.com" style={{ color: '#ffffff', textDecoration: 'none' }}>
                      help@connectsuidhaga.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={18} color="#d4af37" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Atelier Location
                  </div>
                  <div style={{ color: '#f3ece7', marginTop: '2px', lineHeight: 1.5 }}>
                    SUI-DHAGA, Vasai – Virar (East),<br />Maharashtra, India.
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={18} color="#d4af37" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Working Hours
                  </div>
                  <div style={{ color: '#f3ece7', marginTop: '2px' }}>
                    Monday – Saturday: 10:00 AM – 7:30 PM IST
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <a
                href="https://wa.me/918767547514?text=Hi%20SuiDhaga%20%2F%20Komal!%20I'm%20visiting%20the%20Sui-Dhaga%20website%20and%20would%20love%20some%20help."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                  transition: 'transform 0.2s',
                }}
              >
                <OfficialWhatsAppIcon size={18} color="#ffffff" />
                <span>Chat with SuiDhaga on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Luxury Contact Form */}
          <div
            className="card-luxury"
            style={{
              backgroundColor: '#ffffff',
              padding: '2.75rem 2.25rem',
              borderRadius: '16px',
              border: '1px solid #eedfd4',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <CheckCircle2 size={36} color="#16a34a" />
                </div>
                <h3 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--maroon-900)', marginBottom: '0.5rem' }}>
                  Thank You for Reaching Out!
                </h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 2rem' }}>
                  Your message has been received by our atelier team. We will contact you via WhatsApp or email within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <h2 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--maroon-900)', marginBottom: '0.35rem' }}>
                  Send an Inquiry
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
                  Fill in your details below and our team will get in touch promptly.
                </p>

                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#332729', marginBottom: '0.35rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '8px',
                        border: '1.5px solid #dcd4ce',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#332729', marginBottom: '0.35rem' }}>
                        Phone Number (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '8px',
                          border: '1.5px solid #dcd4ce',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#332729', marginBottom: '0.35rem' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. priya@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '8px',
                          border: '1.5px solid #dcd4ce',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Inquiring About Dropdown */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#332729', marginBottom: '0.35rem' }}>
                      Inquiring About
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '8px',
                        border: '1.5px solid #dcd4ce',
                        fontSize: '0.9rem',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Custom Fit / Sizing">Custom Fit / Sizing Consultation</option>
                      <option value="Bridal & Festive Edit">Bridal & Festive Trousseau Consultation</option>
                      <option value="Order Status & Tracking">Order Status & Tracking</option>
                      <option value="Return / Size Exchange">Return / Size Exchange Request</option>
                      <option value="General Outfit Inquiry">General Outfit Inquiry</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#332729', marginBottom: '0.35rem' }}>
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about the outfit you're interested in, custom sizing requirements, or your order details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '8px',
                        border: '1.5px solid #dcd4ce',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{
                      padding: '0.9rem 1.5rem',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 15px rgba(107, 29, 47, 0.25)',
                    }}
                  >
                    <Send size={16} />
                    <span>{submitting ? 'Sending to Atelier...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
