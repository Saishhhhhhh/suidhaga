import React, { useState } from 'react';
import { Layers, Plus, ExternalLink, Package, Tag, Edit3, Check, Eye, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function AdminCategories({ products, onSelectCategoryFilter, onAddNewProductForCategory, onOpenPhonePe, token }) {
  const [categories, setCategories] = useState([
    {
      id: 'ethnic-wear',
      name: 'Ethnic Wear',
      tagline: 'Handcrafted Heritage Couture',
      description: 'Timeless grace crafted in rich silks, Chanderi, and Banarasi handloom weaves.',
      bannerImage: '/assets/ethenic.webp',
      subcategories: ['Anarkali Set', 'Kurta Set', 'Lehenga Choli', 'Pure Silk Saree', 'Sharara Suit'],
      status: 'Active',
      featured: true,
    },
    {
      id: 'travel-ready',
      name: 'Travel Ready',
      tagline: 'Resort & Travel Luxury',
      description: 'Light, breezy, wrinkle-resistant co-ord sets and effortless travel drapes.',
      bannerImage: '/assets/travel.webp',
      subcategories: ['Breezy Co-ord', 'Travel Kaftan', 'Linen Tunic', 'Resort Dress'],
      status: 'Active',
      featured: true,
    },
    {
      id: 'shirts',
      name: 'Shirts',
      tagline: 'Artisanal Tailored Shirts',
      description: 'Crisp hand-finished breathable cottons with subtle needlework and motifs.',
      bannerImage: '/assets/shirts.webp',
      subcategories: ['Handblock Cotton Shirt', 'Silk Blend Shirt', 'Embroidered Tunic', 'Casual Chic'],
      status: 'Active',
      featured: true,
    },
    {
      id: 'indo-western',
      name: 'Indo-Western',
      tagline: 'Modern Fusion Glamour',
      description: 'Contemporary fusion cuts blending Indian embroidery with modern silhouettes.',
      bannerImage: '/assets/indowest.webp',
      subcategories: ['Cape Set', 'Draped Saree', 'Dhoti Jumpsuit', 'Crop Top & Palazzo'],
      status: 'Active',
      featured: true,
    },
  ]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newSubcatInput, setNewSubcatInput] = useState('');

  const handleEditClick = (cat) => {
    setEditingCategory(cat.id);
    setEditFormData({ ...cat });
    setNewSubcatInput('');
  };

  const handleSaveEdit = () => {
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory ? { ...c, ...editFormData } : c))
    );
    setEditingCategory(null);
    alert('Category options updated successfully!');
  };

  const handleAddSubcat = () => {
    if (!newSubcatInput.trim()) return;
    setEditFormData((prev) => ({
      ...prev,
      subcategories: [...(prev.subcategories || []), newSubcatInput.trim()],
    }));
    setNewSubcatInput('');
  };

  const handleRemoveSubcat = (indexToRemove) => {
    setEditFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Helper stats per category
  const getCategoryStats = (categoryName) => {
    const prods = products.filter(
      (p) => p.category?.toLowerCase() === categoryName.toLowerCase()
    );
    const count = prods.length;
    const totalStock = prods.reduce((sum, p) => sum + (p.stock || 0), 0);
    const prices = prods.map((p) => p.price);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    return { count, totalStock, minPrice, maxPrice };
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Category & Collection Options ({categories.length})
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
            Configure frontend collection showcases, subcategory tags, banners, and product assignments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const newName = prompt('Enter New Category Name (e.g. Festive Special):');
              if (!newName) return;
              const newCat = {
                id: newName.toLowerCase().replace(/\s+/g, '-'),
                name: newName,
                tagline: 'Exclusive Collection',
                description: 'Special handcrafted edit designed by Komal.',
                bannerImage: '/assets/hero_banner.jpg',
                subcategories: ['Special Edit'],
                status: 'Active',
                featured: false,
              };
              setCategories([...categories, newCat]);
            }}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <Plus size={18} />
            <span>Add Custom Collection</span>
          </button>
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {categories.map((cat) => {
          const stats = getCategoryStats(cat.name);
          const isEditing = editingCategory === cat.id;

          return (
            <div
              key={cat.id}
              className="card-luxury"
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1.5px solid rgba(107, 29, 47, 0.12)',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              {/* Category Banner Header */}
              <div
                style={{
                  height: '160px',
                  position: 'relative',
                  backgroundImage: `linear-gradient(rgba(38, 5, 14, 0.55), rgba(38, 5, 14, 0.85)), url('${cat.bannerImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff',
                }}
              >
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '0.5rem' }}>
                  <span
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.9)',
                      color: '#26050e',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {cat.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffd700', fontWeight: 700 }}>
                  {cat.tagline}
                </div>
                <h3 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0.2rem 0 0' }}>
                  {cat.name}
                </h3>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-medium)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {cat.description}
                </p>

                {/* Metrics Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    backgroundColor: 'var(--ivory-surface)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Outfits</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--maroon-900)' }}>
                      {stats.count}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Stock Units</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>
                      {stats.totalStock}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2', borderTop: '1px solid #dcd1c6', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Price Range:</span>
                    <strong style={{ color: 'var(--maroon-800)' }}>
                      {stats.count > 0 ? `₹${stats.minPrice.toLocaleString('en-IN')} - ₹${stats.maxPrice.toLocaleString('en-IN')}` : 'No products yet'}
                    </strong>
                  </div>
                </div>

                {/* Subcategories Tags */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Tag size={13} color="var(--gold-600)" />
                    <span>Active Subcategories & Styles:</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {cat.subcategories.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          backgroundColor: '#faf2f4',
                          color: 'var(--maroon-800)',
                          border: '1px solid rgba(107, 29, 47, 0.15)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.74rem',
                          padding: '0.2rem 0.6rem',
                          fontWeight: 600,
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => onSelectCategoryFilter(cat.name)}
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem', justifyContent: 'center' }}
                      title={`View all ${stats.count} products in ${cat.name}`}
                    >
                      <Package size={14} />
                      <span>View Products ({stats.count})</span>
                    </button>

                    <button
                      onClick={() => onAddNewProductForCategory(cat.name)}
                      className="btn btn-gold"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
                      title="Add outfit into this category"
                    >
                      <Plus size={14} />
                      <span>Add Outfit</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleEditClick(cat)}
                    style={{
                      background: 'none',
                      border: '1px dashed #dcd1c6',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem',
                      fontSize: '0.78rem',
                      color: 'var(--text-medium)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Customize Category Options & Banner</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="modal-backdrop" onClick={() => setEditingCategory(null)}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '2rem' }}
          >
            <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Edit Category Options: {editFormData.name}
            </h3>

            <div className="form-group">
              <label className="form-label">Category Title</label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline (Appears in Banner)</label>
              <input
                type="text"
                value={editFormData.tagline || ''}
                onChange={(e) => setEditFormData({ ...editFormData, tagline: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Banner Image URL</label>
              <input
                type="text"
                value={editFormData.bannerImage || ''}
                onChange={(e) => setEditFormData({ ...editFormData, bannerImage: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subcategories / Styles</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Pre-draped Saree"
                  value={newSubcatInput}
                  onChange={(e) => setNewSubcatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubcat();
                    }
                  }}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={handleAddSubcat}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {editFormData.subcategories?.map((sub, sIdx) => (
                  <span
                    key={sIdx}
                    style={{
                      backgroundColor: '#faf2f4',
                      color: 'var(--maroon-900)',
                      border: '1px solid rgba(107, 29, 47, 0.2)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      padding: '0.25rem 0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcat(sIdx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 'bold' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem' }}
              >
                <Check size={16} />
                <span>Save Options</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
