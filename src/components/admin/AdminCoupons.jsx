import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Check, X, Edit2, Trash2, RefreshCw, AlertCircle, Sparkles, Copy, Percent, CheckCircle } from 'lucide-react';

export default function AdminCoupons({ token }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [statusMsg, setStatusMsg] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 0,
    maxDiscountAmount: '',
    usageLimit: '',
    expiresAt: '',
    isActive: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to fetch coupons' });
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setStatusMsg({ type: 'error', text: 'Error connecting to coupon service.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 0,
      maxDiscountAmount: '',
      usageLimit: '',
      expiresAt: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || 10,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      usageLimit: coupon.usageLimit || '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });
    setModalOpen(true);
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}/toggle`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: data.message });
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !c.isActive } : c))
        );
      } else {
        setStatusMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to toggle status.' });
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon code "${coupon.code}"?`)) return;

    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: data.message });
        setCoupons((prev) => prev.filter((c) => c._id !== coupon._id));
      } else {
        setStatusMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete coupon.' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      alert('Please enter a coupon code.');
      return;
    }
    if (Number(formData.discountValue) <= 0) {
      alert('Discount value must be greater than 0.');
      return;
    }
    if (formData.discountType === 'percentage' && Number(formData.discountValue) > 100) {
      alert('Percentage discount cannot exceed 100%.');
      return;
    }

    setSaving(true);
    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        isActive: Boolean(formData.isActive),
      };

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
        setStatusMsg({ type: 'success', text: data.message });
        setModalOpen(false);
        fetchCoupons();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
      alert('An error occurred while saving the coupon.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered list
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && c.isActive) ||
      (statusFilter === 'inactive' && !c.isActive);

    return matchesSearch && matchesStatus;
  });

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0);
  const diwali50Coupon = coupons.find((c) => c.code === 'SUI-DIWALI50');

  return (
    <div className="admin-coupons-page">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--maroon-800)' }}>
            <Tag size={24} />
            <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
              Coupon Codes & Discounts
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Manage promotional codes, secret festival discounts, and special checkout offers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button onClick={fetchCoupons} className="btn btn-outline btn-sm" title="Refresh">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Status Notice Toast */}
      {statusMsg && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: statusMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: statusMsg.type === 'error' ? '#dc2626' : '#16a34a',
            border: `1px solid ${statusMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {statusMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Special Feature Card: SUI-DIWALI50 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2b0b14 0%, #4a1523 50%, #1e060c 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
          color: '#ffffff',
          marginBottom: '2rem',
          border: '1.5px solid var(--border-gold)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 'var(--radius-full)', padding: '0.2rem 0.75rem', fontSize: '0.75rem', color: '#ffd700', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
              <Sparkles size={12} color="#ffd700" />
              <span>Special Festival Deal • 50% Off</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#ffd700',
                  letterSpacing: '0.06em',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px dashed #ffd700',
                }}
              >
                SUI-DIWALI50
              </span>
              <button
                onClick={() => handleCopyCode('SUI-DIWALI50')}
                className="btn btn-outline-gold btn-sm"
                style={{ color: '#ffffff', borderColor: 'rgba(212,175,55,0.5)', padding: '0.35rem 0.75rem' }}
                title="Copy code"
              >
                {copiedCode === 'SUI-DIWALI50' ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                <span>{copiedCode === 'SUI-DIWALI50' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <p style={{ color: '#eed9de', fontSize: '0.88rem', marginTop: '0.6rem', maxWidth: '620px', lineHeight: 1.5 }}>
              Applicable on <strong>any product</strong> added to bag. Designed to be manually typed by customers in the Shopping Bag or Checkout.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#ffd700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: diwali50Coupon?.isActive !== false ? '#4ade80' : '#f87171', marginTop: '0.2rem' }}>
              {diwali50Coupon?.isActive !== false ? '● ACTIVE & READY' : '○ INACTIVE'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#c5b5ae', marginTop: '0.25rem' }}>
              Used {diwali50Coupon?.timesUsed || 0} times
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e7ded4' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Coupons</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--maroon-900)', marginTop: '0.25rem' }}>
            {coupons.length}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e7ded4' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Coupons</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', marginTop: '0.25rem' }}>
            {activeCount}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e7ded4' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Redemptions</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-600)', marginTop: '0.25rem' }}>
            {totalRedemptions}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #e7ded4',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1, maxWidth: '420px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['all', 'active', 'inactive'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                border: '1px solid #d4c8c0',
                backgroundColor: statusFilter === st ? 'var(--maroon-800)' : '#ffffff',
                color: statusFilter === st ? '#ffffff' : 'var(--text-dark)',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #e7ded4',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#faf6f2', borderBottom: '1px solid #e7ded4', color: 'var(--text-medium)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>Coupon Code</th>
                <th style={{ padding: '0.9rem 1rem' }}>Discount</th>
                <th style={{ padding: '0.9rem 1rem' }}>Description</th>
                <th style={{ padding: '0.9rem 1rem' }}>Min Order</th>
                <th style={{ padding: '0.9rem 1rem' }}>Redemptions</th>
                <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No coupons found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f0eae4', transition: 'background-color 0.15s' }}>
                    {/* Code */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            color: 'var(--maroon-900)',
                            backgroundColor: '#fbf4f2',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            border: '1px dashed rgba(107,29,47,0.3)',
                          }}
                        >
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(c.code)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '0.2rem' }}
                          title="Copy coupon code"
                        >
                          {copiedCode === c.code ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>

                    {/* Discount */}
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          color: c.discountValue >= 50 ? '#dc2626' : '#16a34a',
                          backgroundColor: c.discountValue >= 50 ? '#fef2f2' : '#f0fdf4',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          display: 'inline-block',
                        }}
                      >
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                      </span>
                    </td>

                    {/* Description */}
                    <td style={{ padding: '1rem', color: 'var(--text-medium)', maxWidth: '240px' }}>
                      {c.description || '—'}
                    </td>

                    {/* Min Order */}
                    <td style={{ padding: '1rem' }}>
                      {c.minOrderAmount > 0 ? `₹${c.minOrderAmount.toLocaleString('en-IN')}` : 'No minimum'}
                    </td>

                    {/* Redemptions */}
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--maroon-900)' }}>{c.timesUsed || 0}</span>
                      {c.usageLimit && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}> / {c.usageLimit}</span>}
                    </td>

                    {/* Status Toggle */}
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleToggleStatus(c)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: c.isActive ? '#dcfce7' : '#f3f4f6',
                          color: c.isActive ? '#15803d' : '#6b7280',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                        title={`Click to ${c.isActive ? 'deactivate' : 'activate'}`}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.isActive ? '#22c55e' : '#9ca3af' }} />
                        <span>{c.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          style={{
                            border: '1px solid #d4c8c0',
                            backgroundColor: '#ffffff',
                            color: 'var(--maroon-800)',
                            borderRadius: '4px',
                            padding: '0.35rem 0.55rem',
                            cursor: 'pointer',
                          }}
                          title="Edit coupon"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          style={{
                            border: '1px solid #fecaca',
                            backgroundColor: '#fff5f5',
                            color: '#dc2626',
                            borderRadius: '4px',
                            padding: '0.35rem 0.55rem',
                            cursor: 'pointer',
                          }}
                          title="Delete coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--maroon-900)', margin: 0 }}>
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Coupon'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* Code */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUI-DIWALI50"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}
                />
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Description / Offer Details</label>
                <input
                  type="text"
                  placeholder="e.g. Special 50% Off on Diwali collection"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Discount Type & Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="form-select"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Minimum Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = No minimum"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave blank for none"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="couponActiveCheckbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--maroon-800)', cursor: 'pointer' }}
                />
                <label htmlFor="couponActiveCheckbox" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                  Coupon is Active & Redeemable
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #ede4dc', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline btn-sm"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  <Check size={15} />
                  <span>{saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

