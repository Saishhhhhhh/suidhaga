import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Image as ImageIcon, Upload, Trash2, Plus, Star } from 'lucide-react';

export default function ProductFormModal({ product, isOpen, onClose, onSave, token }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: 'Anarkalis',
    fabric: 'Pure Silk Blend',
    stock: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/maroon_anarkali.jpg'],
    shortDescription: '',
    description: '',
    isBestseller: false,
    isNewArrival: false,
    isFeatured: false,
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || 'Anarkalis',
        fabric: product.fabric || 'Pure Silk Blend',
        stock: product.stock !== undefined ? product.stock : 15,
        sizes: product.sizes || ['S', 'M', 'L', 'XL'],
        images: product.images && product.images.length > 0 ? product.images : ['/assets/maroon_anarkali.jpg'],
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        isBestseller: !!product.isBestseller,
        isNewArrival: !!product.isNewArrival,
        isFeatured: !!product.isFeatured,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      });
    } else {
      setFormData({
        title: '',
        price: '',
        originalPrice: '',
        category: 'Anarkalis',
        fabric: 'Pure Silk Blend',
        stock: 15,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        images: ['/assets/maroon_anarkali.jpg'],
        shortDescription: '',
        description: '',
        isBestseller: false,
        isNewArrival: true,
        isFeatured: false,
        tags: '',
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSizeToggle = (sz) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(sz);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz],
      };
    });
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('images', files[i]);
      }

      const res = await fetch('/api/upload/images', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: uploadData,
      });

      const resData = await res.json();
      if (resData.success && resData.urls) {
        setFormData((prev) => {
          // Filter out default placeholder if present
          const cleanPrev = prev.images.filter((img) => img !== '/assets/maroon_anarkali.jpg');
          return {
            ...prev,
            images: [...cleanPrev, ...resData.urls],
          };
        });
      } else {
        setFormError(resData.message || 'Error uploading images');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setFormError('Failed to upload images. Please check file format.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimary = (idx) => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      const [chosen] = imgs.splice(idx, 1);
      return {
        ...prev,
        images: [chosen, ...imgs],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title || !formData.price || !formData.category) {
      setFormError('Please fill in Title, Price and Category');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock),
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else {
        setFormError(data.message || 'Error saving product');
      }
    } catch (err) {
      setFormError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #ede4dc', paddingBottom: '0.8rem' }}>
          <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.45rem', fontWeight: 800 }}>
            {product ? 'Edit Ethnic Wear Outfit' : 'Add New Ethnic Wear Outfit'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}>
            <X size={22} />
          </button>
        </div>

        {formError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)',
              color: '#dc2626',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Roopali Handcrafted Chanderi Anarkali Set"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                {[
                  { name: 'Ethnic Wear', icon: '👑', hint: 'Kurtas, Anarkalis, Lehengas' },
                  { name: 'Travel Ready', icon: '✈️', hint: 'Co-ords, Resort, Kaftans' },
                  { name: 'Shirts', icon: '👔', hint: 'Handblock Cotton & Silk' },
                  { name: 'Indo-Western', icon: '✨', hint: 'Fusion, Capes, Drapes' },
                ].map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.name })}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.category === cat.name ? '2px solid var(--maroon-800)' : '1px solid #dcd1c6',
                      backgroundColor: formData.category === cat.name ? '#faf2f4' : '#ffffff',
                      color: formData.category === cat.name ? 'var(--maroon-900)' : 'var(--text-dark)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.1rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.84rem' }}>
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{cat.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                min={0}
                value={formData.price}
                onChange={handleChange}
                placeholder="2999"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Price / MRP (₹)</label>
              <input
                type="number"
                name="originalPrice"
                min={0}
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="4499"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Units Available</label>
              <input
                type="number"
                name="stock"
                min={0}
                value={formData.stock}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Fabric Specification</label>
              <input
                type="text"
                name="fabric"
                value={formData.fabric}
                onChange={handleChange}
                placeholder="e.g. Pure Chanderi Silk, Georgette, Organza"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Maroon, Festive, Silk, Zardozi"
                className="form-input"
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="form-group">
            <label className="form-label">Available Sizes</label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => {
                const active = formData.sizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => handleSizeToggle(sz)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: active ? '1.5px solid var(--maroon-800)' : '1px solid #d4c8c0',
                      backgroundColor: active ? 'var(--maroon-800)' : '#ffffff',
                      color: active ? '#ffffff' : 'var(--text-dark)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    {sz} {active ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Images Direct Upload */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                Product Photos ({formData.images.length})
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                First photo is the Cover Image • Direct Local Storage
              </span>
            </div>

            {/* Existing uploaded thumbnails gallery */}
            {formData.images.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: idx === 0 ? '2.5px solid var(--gold-600)' : '1px solid #d4c8c0',
                      aspectRatio: '3/4',
                      backgroundColor: '#f6f0ea',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Product ${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          backgroundColor: 'var(--maroon-900)',
                          color: '#fdfaf2',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.4rem',
                          borderRadius: '3px',
                          border: '1px solid var(--border-gold)',
                        }}
                      >
                        Cover
                      </span>
                    )}

                    {/* Hover Overlay Controls */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.3rem 0.45rem',
                      }}
                    >
                      {idx !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          title="Set as Cover"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fbbf24',
                            cursor: 'pointer',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: 0,
                          }}
                        >
                          Make Cover
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.65rem', color: '#86efac', fontWeight: 600 }}>Primary</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove Image"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fca5a5',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Direct File Drop / Upload Area */}
            <label
              style={{
                border: '2px dashed var(--border-gold)',
                backgroundColor: uploading ? 'var(--ivory-surface)' : '#faf7f3',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: uploading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <Upload size={26} color="var(--maroon-800)" style={{ marginBottom: '0.4rem' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
                {uploading ? 'Uploading Product Images...' : 'Click to Upload Product Photos'}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Select JPG, PNG, WEBP files from your computer (Multiple photos supported)
              </span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Short Tagline Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief 1-sentence highlight for cards"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Complete Story & Craftsmanship Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe embroidery, detailing, occasion styling tips..."
              className="form-textarea"
            />
          </div>

          {/* Badges Toggle */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" name="isBestseller" checked={formData.isBestseller} onChange={handleChange} />
              <span>Mark as Bestseller</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} />
              <span>Mark as New Launch</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              <span>Feature on Homepage</span>
            </label>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', borderTop: '1px solid #ede4dc', paddingTop: '1.2rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '150px' }}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
