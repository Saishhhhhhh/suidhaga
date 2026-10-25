import React, { useState, useEffect } from 'react';
import { Upload, Sparkles, Check, Image as ImageIcon, MessageCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function AdminHeroSettings({ token }) {
  const [formData, setFormData] = useState({
    heroTitle: 'Crafted by hand, grounded in care.',
    heroSubtitle: 'Curated pure silks, artisanal handloom fabrics, and regal silhouettes.',
    heroBannerUrl: '/assets/hero_banner.jpg',
    heroBadge: 'Grand Festive Edit 2026',
    ctaText: 'Explore Collection',
    whatsappNumber: '+91 97730 01771',
    bannerPosition: 'center center',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings/hero');
      const data = await res.json();
      if (data.success && data.hero) {
        setFormData((prev) => ({
          ...prev,
          ...data.hero,
        }));
      }
    } catch (err) {
      console.error('Error fetching hero settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg(null);

    const bodyData = new FormData();
    bodyData.append('image', file);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bodyData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          heroBannerUrl: data.url,
        }));
        setStatusMsg({ type: 'success', text: 'Banner image uploaded successfully! Click "Save Changes" below to publish.' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to upload image' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error connecting to upload server' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/settings/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Homepage banner and headline published successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Error saving hero settings' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Homepage Banner & Headline Manager
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
            Upload the main storefront hero banner, update headline titles, badges, and WhatsApp concierge number.
          </p>
        </div>

        <button
          onClick={fetchHero}
          className="btn btn-outline btn-sm"
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.75rem',
            backgroundColor: statusMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${statusMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            color: statusMsg.type === 'error' ? '#dc2626' : '#166534',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <span>{statusMsg.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Left: Settings Form */}
        <div className="card-luxury" style={{ padding: '2rem' }}>
          <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--maroon-900)', marginBottom: '1.5rem', fontWeight: 700 }}>
            Banner Content & Headline
          </h3>

          <form onSubmit={handleSave}>
            {/* Banner Photo Upload */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>
                Hero Background Banner Image
              </label>
              
              <label
                style={{
                  border: '2px dashed var(--border-gold)',
                  backgroundColor: uploading ? 'var(--ivory-surface)' : '#faf7f3',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: uploading ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={handleBannerUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={28} color="var(--maroon-800)" style={{ marginBottom: '0.4rem' }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
                  {uploading ? 'Uploading Banner...' : 'Click to Upload New Hero Banner'}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Select high-resolution JPG, PNG, WEBP (Recommended: 1920×1080px)
                </span>
              </label>
            </div>

            {/* Banner Alignment / Focal Point */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>
                Banner Alignment (Focal Point)
              </label>
              <select
                name="bannerPosition"
                value={formData.bannerPosition || 'center center'}
                onChange={handleChange}
                className="form-input"
                style={{ backgroundColor: '#ffffff', fontWeight: 600 }}
              >
                <option value="center center">Center (Default - Full balanced view)</option>
                <option value="center top">Top Center (Focus on top of banner)</option>
                <option value="center bottom">Bottom Center (Focus on bottom of banner)</option>
                <option value="right center">Right Side (Focus on right-side model/subject)</option>
                <option value="left center">Left Side (Focus on left-side model/subject)</option>
              </select>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Prevents the banner from getting pushed into the corner or cropped awkwardly.
              </span>
            </div>

            {/* Headline Title */}
            <div className="form-group">
              <label className="form-label">Main Heading Title *</label>
              <textarea
                rows={2}
                name="heroTitle"
                required
                value={formData.heroTitle}
                onChange={handleChange}
                placeholder="Crafted by hand, grounded in care."
                className="form-textarea"
                style={{ fontWeight: 600, fontSize: '1.05rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Displayed prominently in royal typography on the storefront.
              </span>
            </div>

            {/* Subtitle Description */}
            <div className="form-group">
              <label className="form-label">Subheadline / Tagline Description</label>
              <textarea
                rows={3}
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                placeholder="Curated pure silks, artisanal handloom fabrics, and regal silhouettes..."
                className="form-textarea"
              />
            </div>

            {/* Top Badge */}
            <div className="form-group">
              <label className="form-label">Top Highlight Badge Text</label>
              <input
                type="text"
                name="heroBadge"
                value={formData.heroBadge}
                onChange={handleChange}
                placeholder="e.g. Grand Festive Edit 2026"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* CTA Button Text */}
              <div className="form-group">
                <label className="form-label">Primary Button Text</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleChange}
                  placeholder="Explore Collection"
                  className="form-input"
                />
              </div>

              {/* WhatsApp Contact */}
              <div className="form-group">
                <label className="form-label">WhatsApp Contact Number</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="+91 97730 01771"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn btn-primary"
                style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}
              >
                <Check size={18} />
                <span>{saving ? 'Publishing Changes...' : 'Save & Publish Banner'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Visual Preview */}
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--maroon-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ImageIcon size={18} color="var(--gold-600)" />
            <span>Storefront Live Visual Preview</span>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '2.5rem',
              color: '#ffffff',
              boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
              border: '2px solid var(--border-gold)',
              backgroundColor: '#1c080e',
            }}
          >
            {/* Background Image Layer */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
              <img
                src={formData.heroBannerUrl || '/assets/hero_banner.jpg'}
                alt="Banner Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: formData.bannerPosition || 'center center',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to right, rgba(28, 8, 14, 0.90) 0%, rgba(28, 8, 14, 0.65) 50%, rgba(28, 8, 14, 0.20) 100%)',
                }}
              />
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              {formData.heroBadge && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--gold-300)',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  width: 'fit-content',
                }}
              >
                <Sparkles size={12} color="#d4af37" />
                <span>{formData.heroBadge}</span>
              </div>
            )}

            <h2
              className="font-display"
              style={{
                fontSize: '1.9rem',
                fontWeight: 700,
                lineHeight: 1.25,
                color: '#ffffff',
                marginBottom: '0.85rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {formData.heroTitle || 'Your Headline Here'}
            </h2>

            {formData.heroSubtitle && (
              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#f0e6e0',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                  maxWidth: '420px',
                }}
              >
                {formData.heroSubtitle}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  backgroundColor: 'var(--gold-500)',
                  color: '#1f1416',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>{formData.ctaText || 'Explore Collection'}</span>
                <ArrowRight size={14} />
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <MessageCircle size={14} color="#25D366" />
                <span>Talk to Komal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

