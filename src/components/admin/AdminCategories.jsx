import React, { useState } from 'react';
import { Layers, Plus, Edit2, Tag, Check, X, Eye, Package, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminCategories({
  products,
  token,
  onSelectCategoryFilter,
  onAddNewProductForCategory,
  onOpenPhonePe,
}) {
  const [categories, setCategories] = useState([
    {
      id: 'ethnic-wear',
      name: 'Ethnic Wear',
      tagline: 'Handcrafted Heritage Couture',
      description: 'Timeless grace crafted in rich silks, Chanderi, and Banarasi handloom weaves.',
      bannerImage: '/assets/hero_banner.jpg',
      subcategories: ['Anarkali Set', 'Kurta Set', 'Lehenga Choli', 'Pure Silk Saree', 'Sharara Suit'],
      status: 'Active',
      featured: true,
    },
    {
      id: 'travel-ready',
      name: 'Travel Ready',
      tagline: 'Resort & Travel Luxury',
      description: 'Light, breezy, wrinkle-resistant co-ord sets and effortless travel drapes.',
      bannerImage: '/assets/travel_ready.webp',
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
      tagline: 'Modern Fusion & Capes',
      description: 'Contemporary chic cuts fused with Indian artisanal heritage textures.',
      bannerImage: '/assets/hero_banner.jpg',
      subcategories: ['Cape Gown', 'Dhoti Co-ord', 'Crop Top & Palazzos', 'Fusion Drape'],
      status: 'Active',
      featured: false,
    },
  ]);

  // Modals state (Custom in-website popups - NO browser native alerts/prompts)
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newSubcatInput, setNewSubcatInput] = useState('');
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Add category modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatData, setNewCatData] = useState({
    name: '',
    tagline: 'Handcrafted Luxury Collection',
    description: 'Special handcrafted edit designed by Komal for Sui-Dhaga.',
    bannerImage: '/assets/hero_banner.jpg',
    subcategories: 'Festive Wear, Handcrafted Edit',
  });
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat.id);
    setEditFormData({ ...cat });
    setNewSubcatInput('');
  };

  const handleBannerUpload = async (e, targetForm = 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
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
        if (targetForm === 'edit') {
          setEditFormData((prev) => ({ ...prev, bannerImage: data.url }));
        } else {
          setNewCatData((prev) => ({ ...prev, bannerImage: data.url }));
        }
        showToast('Banner image uploaded successfully!');
      } else {
        showToast(data.message || 'Error uploading banner image', 'error');
      }
    } catch (err) {
      showToast('Failed to upload image. Please check file format.', 'error');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleSaveEdit = () => {
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory ? { ...c, ...editFormData } : c))
    );
    setEditingCategory(null);
    showToast('Category options updated successfully!');
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatData.name.trim()) {
      showToast('Please enter a collection name', 'error');
      return;
    }

    const subcats = newCatData.subcategories
      ? newCatData.subcategories.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Special Edit'];

    const newCat = {
      id: newCatData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: newCatData.name.trim(),
      tagline: newCatData.tagline.trim(),
      description: newCatData.description.trim(),
      bannerImage: newCatData.bannerImage || '/assets/hero_banner.jpg',
      subcategories: subcats,
      status: 'Active',
      featured: false,
    };

    setCategories((prev) => [...prev, newCat]);
    setIsAddModalOpen(false);
    setNewCatData({
      name: '',
      tagline: 'Handcrafted Luxury Collection',
      description: 'Special handcrafted edit designed by Komal for Sui-Dhaga.',
      bannerImage: '/assets/hero_banner.jpg',
      subcategories: 'Festive Wear, Handcrafted Edit',
    });
    showToast(`Collection "${newCat.name}" added successfully!`);
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
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '2rem',
            zIndex: 3000,
            backgroundColor: toastMsg.type === 'error' ? '#dc2626' : 'var(--maroon-900)',
            color: '#ffffff',
            padding: '0.75rem 1.4rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            border: '1px solid var(--border-gold)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <span>{toastMsg.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{toastMsg.text}</span>
        </div>
      )}

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
            onClick={() => setIsAddModalOpen(true)}
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

          return (
            <div
              key={cat.id}
              className="card-luxury"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(107, 29, 47, 0.1)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {/* Card Banner Header */}
              <div
                style={{
                  position: 'relative',
                  height: '140px',
                  background: `linear-gradient(to bottom, rgba(38, 5, 14, 0.4) 0%, rgba(38, 5, 14, 0.88) 100%), url('${cat.bannerImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    right: '0.85rem',
                    backgroundColor: cat.status === 'Active' ? 'rgba(22, 163, 74, 0.9)' : 'rgba(100, 116, 139, 0.8)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                  }}
                >
                  {cat.status}
                </span>

                <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {cat.tagline}
                </div>
                <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.2rem 0 0' }}>
                  {cat.name}
                </h3>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {cat.description}
                </p>

                {/* Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    backgroundColor: 'var(--ivory-surface)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Outfits</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--maroon-900)' }}>
                      {stats.count}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Stock Units</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>
                      {stats.totalStock}
                    </div>
                  </div>
                  {stats.minPrice > 0 && (
                    <div style={{ gridColumn: 'span 2', fontSize: '0.76rem', color: 'var(--text-muted)', paddingTop: '0.4rem', borderTop: '1px dashed #dcd1c6' }}>
                      Price Range: <strong>₹{stats.minPrice.toLocaleString('en-IN')} - ₹{stats.maxPrice.toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                </div>

                {/* Subcategories list */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Tag size={12} color="var(--gold-600)" />
                    <span>Active Subcategories & Styles:</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {cat.subcategories.map((sub, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: '#faf2f4',
                          color: 'var(--maroon-900)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(107, 29, 47, 0.15)',
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
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, padding: '0.5rem' }}
                    >
                      <Eye size={14} />
                      <span>View Products ({stats.count})</span>
                    </button>
                    <button
                      onClick={() => onAddNewProductForCategory(cat.name)}
                      className="btn btn-gold btn-sm"
                      style={{ padding: '0.5rem 0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Outfit</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleEditClick(cat)}
                    style={{
                      background: 'none',
                      border: '1px dashed var(--border-delicate)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--maroon-800)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Customize Category Options & Banner</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Edit Category Options (Upload Image ONLY - No URL Input) */}
      {editingCategory && (
        <div className="modal-backdrop" onClick={() => setEditingCategory(null)}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '620px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                Edit Category Options: {editFormData.name}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
              >
                <X size={20} />
              </button>
            </div>

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

            {/* Direct Image Upload for Category Banner (No URL Option) */}
            <div className="form-group">
              <label className="form-label">Category Banner Image</label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <div
                  style={{
                    width: '120px',
                    height: '75px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: '1.5px solid var(--border-gold)',
                    backgroundColor: '#f3ece7',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={editFormData.bannerImage || '/assets/hero_banner.jpg'}
                    alt="Banner preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <label
                  style={{
                    border: '2px dashed var(--border-gold)',
                    backgroundColor: uploadingBanner ? 'var(--ivory-surface)' : '#faf7f3',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 1.25rem',
                    textAlign: 'center',
                    cursor: uploadingBanner ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    flexGrow: 1,
                    justifyContent: 'center',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingBanner}
                    onChange={(e) => handleBannerUpload(e, 'edit')}
                    style={{ display: 'none' }}
                  />
                  <Upload size={18} color="var(--maroon-800)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
                    {uploadingBanner ? 'Uploading Banner...' : 'Upload New Banner Photo'}
                  </span>
                </label>
              </div>
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

      {/* Modal 2: Add Custom Collection (In-app popup, replacing native prompt) */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  Create Custom Collection
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                  Define a new category showcase for the storefront.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label className="form-label">Collection Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festive Special / Wedding Edit"
                  value={newCatData.name}
                  onChange={(e) => setNewCatData({ ...newCatData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline (Appears in Banner)</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Embroidered Couture"
                  value={newCatData.tagline}
                  onChange={(e) => setNewCatData({ ...newCatData, tagline: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Direct Banner Upload */}
              <div className="form-group">
                <label className="form-label">Collection Banner Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      width: '100px',
                      height: '65px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: '1.5px solid var(--border-gold)',
                      backgroundColor: '#f3ece7',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={newCatData.bannerImage}
                      alt="Banner Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <label
                    style={{
                      border: '2px dashed var(--border-gold)',
                      backgroundColor: uploadingBanner ? 'var(--ivory-surface)' : '#faf7f3',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      cursor: uploadingBanner ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexGrow: 1,
                      justifyContent: 'center',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingBanner}
                      onChange={(e) => handleBannerUpload(e, 'add')}
                      style={{ display: 'none' }}
                    />
                    <Upload size={16} color="var(--maroon-800)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
                      {uploadingBanner ? 'Uploading...' : 'Upload Banner Image'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief story or styling guidance..."
                  value={newCatData.description}
                  onChange={(e) => setNewCatData({ ...newCatData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subcategory Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Sangeet Special, Pastel Lehenga, Festive Silk"
                  value={newCatData.subcategories}
                  onChange={(e) => setNewCatData({ ...newCatData, subcategories: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingBanner}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  <Plus size={16} />
                  <span>Create Collection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
