import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Sparkles, AlertTriangle, ArrowUpDown, Globe } from 'lucide-react';

export default function AdminProducts({ products, loading, onRefresh, onEditProduct, onAddNew, token, initialCategory = 'All' }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || 'All');

  useEffect(() => {
    if (initialCategory) {
      setCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message || 'Error deleting product');
      }
    } catch (err) {
      alert('Failed to connect to server');
    }
  };

  const handleStockAdjust = async (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });
      onRefresh();
    } catch (err) {
      console.error('Error updating stock', err);
    }
  };

  const categories = ['All', 'Ethnic Wear', 'Travel Ready', 'Shirts', 'Indo-Western'];

  return (
    <div>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Product Catalog Management ({products.length})
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
            Manage inventory, pricing, handcrafted specifications, and stock levels.
          </p>
        </div>

        <button onClick={onAddNew} className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
          <Plus size={18} />
          <span>Add New Ethnic Outfit</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card-luxury"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexGrow: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--maroon-700)" />
          <input
            type="text"
            placeholder="Search by title, SKU, or fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-luxury" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--ivory-surface)', borderBottom: '1px solid #dcd1c6', color: 'var(--maroon-900)' }}>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Category & Fabric</th>
              <th style={{ padding: '1rem' }}>Price & MRP</th>
              <th style={{ padding: '1rem' }}>Stock Units</th>
              <th style={{ padding: '1rem' }}>Badges & Source</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No products found. Click "Add New Ethnic Outfit" or import from WordPress!
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  style={{ borderBottom: '1px solid rgba(107, 29, 47, 0.08)', transition: 'background-color 0.15s' }}
                  className="table-row-hover"
                >
                  {/* Image & Title */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <img
                        src={p.images?.[0] || '/assets/maroon_anarkali.jpg'}
                        alt={p.title}
                        style={{ width: '48px', height: '62px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#f3ece7' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-dark)', maxWidth: '240px', lineHeight: 1.3 }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          SKU: {p.sku || 'SD-XXXX'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Fabric */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{p.category}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.fabric || 'Pure Silk Blend'}</div>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--maroon-800)' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                    {p.originalPrice > p.price && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{p.originalPrice.toLocaleString('en-IN')} ({p.discount}% Off)
                      </div>
                    )}
                  </td>

                  {/* Stock with quick adjust */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleStockAdjust(p, -1)}
                          style={{ border: '1px solid #ccc', background: '#fff', borderRadius: '3px', width: '22px', height: '22px', cursor: 'pointer', fontWeight: 700 }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            fontWeight: 700,
                            minWidth: '26px',
                            textAlign: 'center',
                            color: (p.stock !== undefined ? p.stock : 15) <= 0 ? '#dc2626' : (p.stock || 0) <= 5 ? '#b45309' : 'var(--text-dark)',
                          }}
                        >
                          {p.stock !== undefined ? p.stock : 15}
                        </span>
                        <button
                          onClick={() => handleStockAdjust(p, 1)}
                          style={{ border: '1px solid #ccc', background: '#fff', borderRadius: '3px', width: '22px', height: '22px', cursor: 'pointer', fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>

                      {/* Stock Status Badge */}
                      {(p.stock !== undefined ? p.stock : 15) <= 0 ? (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '3px',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            width: 'fit-content',
                          }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#ffffff' }}></span>
                          Sold Out
                        </span>
                      ) : (p.stock || 0) <= 5 ? (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '3px',
                            backgroundColor: '#fef3c7',
                            color: '#b45309',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            width: 'fit-content',
                          }}
                        >
                          <AlertTriangle size={11} /> Low Stock
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Badges & Source */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {p.isBestseller && <span className="badge-gold">Bestseller</span>}
                      {p.isNewArrival && <span className="badge-maroon">New</span>}
                      {p.wpSource && p.wpSource.includes('wordpress') && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: '#21759b',
                            color: '#ffffff',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          <Globe size={11} /> WP Import
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => onEditProduct(p)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #d4c8c0',
                          borderRadius: '4px',
                          padding: '0.4rem 0.6rem',
                          cursor: 'pointer',
                          color: 'var(--maroon-800)',
                        }}
                        title="Edit product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #fecaca',
                          borderRadius: '4px',
                          padding: '0.4rem 0.6rem',
                          cursor: 'pointer',
                          color: '#dc2626',
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: #faf6f2;
        }
      `}</style>
    </div>
  );
}
