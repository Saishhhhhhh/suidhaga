import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Image as ImageIcon } from 'lucide-react';

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

  const presetImages = [
    { label: 'Maroon Velvet Gown', url: '/assets/hero_banner.jpg' },
    { label: 'Maroon Anarkali', url: '/assets/maroon_anarkali.jpg' },
    { label: 'Emerald Kurta Set', url: '/assets/emerald_kurta.jpg' },
    { label: 'Blush Rose Lehenga', url: '/assets/blush_lehenga.jpg' },
    { label: 'Mustard Sharara', url: '/assets/mustard_sharara.jpg' },
    { label: 'Indo-Western Cape', url: '/assets/indowestern_cape.jpg' },
    { label: 'Organza Saree', url: '/assets/organza_saree.jpg' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill in Title, Price and Category');
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
        alert(data.message || 'Error saving product');
      }
    } catch (err) {
      alert('Failed to save product');
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
              <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                <option value="Anarkalis">Anarkalis</option>
                <option value="Kurtas & Sets">Kurtas & Sets</option>
                <option value="Indo-Western">Indo-Western</option>
                <option value="Lehengas">Lehengas</option>
                <option value="Sarees">Sarees</option>
                <option value="Festive Edit">Festive Edit</option>
              </select>
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

          {/* Image URL & Preset Selection */}
          <div className="form-group">
            <label className="form-label">Primary Image URL</label>
            <input
              type="text"
              value={formData.images[0] || ''}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
              placeholder="/assets/maroon_anarkali.jpg or https://..."
              className="form-input"
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Pick Asset:</span>
              {presetImages.map((p) => (
                <button
                  type="button"
                  key={p.url}
                  onClick={() => setFormData({ ...formData, images: [p.url] })}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #d4c8c0',
                    backgroundColor: formData.images[0] === p.url ? 'var(--maroon-50)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
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
