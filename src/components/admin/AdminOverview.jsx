import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, AlertTriangle, Globe, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

export default function AdminOverview({ token, setActiveTab, onAddNewProduct }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStock: 0,
    wpImported: 0,
    recentOrders: [],
    categoryStats: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [orderRes, prodRes] = await Promise.all([
        fetch('/api/orders/stats/summary', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/products/stats/summary', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const orderData = await orderRes.json();
      const prodData = await prodRes.json();

      setStats({
        totalRevenue: orderData.stats?.totalRevenue || 0,
        totalOrders: orderData.stats?.totalOrders || 0,
        recentOrders: orderData.stats?.recentOrders || [],
        totalProducts: prodData.stats?.total || 0,
        lowStock: prodData.stats?.lowStock || 0,
        wpImported: prodData.stats?.wpImported || 0,
        categoryStats: prodData.stats?.categoryStats || [],
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      sub: 'All confirmed orders',
      icon: DollarSign,
      color: '#d4af37',
      bg: 'rgba(212, 175, 55, 0.12)',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      sub: 'Lifetime customer orders',
      icon: ShoppingBag,
      color: 'var(--maroon-800)',
      bg: 'var(--maroon-50)',
    },
    {
      label: 'Active Outfits',
      value: stats.totalProducts,
      sub: 'In catalog database',
      icon: Package,
      color: '#0284c7',
      bg: '#f0f9ff',
    },
    {
      label: 'Low Stock Alerts',
      value: stats.lowStock,
      sub: 'Units <= 5 remaining',
      icon: AlertTriangle,
      color: stats.lowStock > 0 ? '#dc2626' : '#16a34a',
      bg: stats.lowStock > 0 ? '#fef2f2' : '#f0fdf4',
    },
    {
      label: 'WordPress Imports',
      value: stats.wpImported,
      sub: 'Synced from WP/Woo',
      icon: Globe,
      color: '#21759b',
      bg: '#f0f7fa',
    },
  ];

  return (
    <div>
      {/* Top Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-display maroon-gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>
            Welcome, Komal! ✨
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem' }}>
            Here is your live business overview for <strong>SUI-DHAGA Ethnic Wear</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('wordpress')} className="btn btn-gold btn-sm">
            <Globe size={15} />
            <span>Import from WordPress</span>
          </button>
          <button onClick={onAddNewProduct} className="btn btn-primary btn-sm">
            <Package size={15} />
            <span>+ Add New Outfit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="card-luxury" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-medium)' }}>
                  {c.label}
                </span>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: c.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: c.color,
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.1, marginBottom: '0.3rem' }}>
                {c.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Left: Recent Orders */}
        <div className="card-luxury" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Recent Customer Orders
            </h3>
            <button
              onClick={() => setActiveTab('orders')}
              style={{ background: 'none', border: 'none', color: 'var(--maroon-800)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No orders placed yet. New customer orders will show up here!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {stats.recentOrders.map((ord) => (
                <div
                  key={ord._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: 'var(--ivory-surface)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--maroon-900)' }}>{ord.orderId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ord.customer?.name} • {ord.items?.length} item(s)
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800 }}>₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                    <span className="badge-gold" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Category Breakdown */}
        <div className="card-luxury" style={{ padding: '1.75rem' }}>
          <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Catalog Distribution by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.categoryStats.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Load products to see category breakdown.
              </div>
            ) : (
              stats.categoryStats.map((cat) => {
                const percent = stats.totalProducts > 0 ? Math.round((cat.count / stats.totalProducts) * 100) : 0;
                return (
                  <div key={cat._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                      <span>{cat._id}</span>
                      <span>{cat.count} items ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e8ded4', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: 'var(--maroon-800)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
