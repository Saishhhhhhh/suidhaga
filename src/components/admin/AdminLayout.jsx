import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Globe, ArrowLeft, LogOut, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminWordpressImport from './AdminWordpressImport';
import ProductFormModal from './ProductFormModal';

export default function AdminLayout({ adminUser, token, onLogout, onBackToStore }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'wordpress'
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modal for add/edit product
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchAdminProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Package, count: products.length },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
    { id: 'wordpress', label: 'WordPress Importer', icon: Globe, highlight: true },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f6f2' }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#26050e',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(212, 175, 55, 0.3)',
          flexShrink: 0,
        }}
        className="admin-sidebar"
      >
        {/* Brand Logo Header */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src="/assets/logo.webp" alt="Sui Dhaga" style={{ height: '46px', filter: 'brightness(1.15)' }} />
            <div>
              <div className="font-royal" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em' }}>
                SUI-DHAGA
              </div>
              <div style={{ fontSize: '0.68rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Admin Console
              </div>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--maroon-800)',
              border: '1.5px solid var(--gold-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#ffffff',
            }}
          >
            K
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {adminUser?.name || 'Komal (Store Owner)'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#d4af37' }}>
              Verified Administrator
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1.25rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flexGrow: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--maroon-800)' : 'transparent',
                  color: isActive ? '#ffffff' : item.highlight ? '#d4af37' : '#e0d5cb',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? '#d4af37' : item.highlight ? '#d4af37' : '#c2b3a8'} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button
            onClick={onBackToStore}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'none',
              border: 'none',
              color: '#d4af37',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.4rem 0.6rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Visit Customer Store</span>
          </button>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.4rem 0.6rem',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Navbar */}
        <div
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e7ded4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#16a34a',
                backgroundColor: '#dcfce7',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              MongoDB Atlas: Connected
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Database: <code>suidhaga</code>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handleAddNew} className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Add Outfit</span>
            </button>
            <button onClick={onBackToStore} className="btn btn-outline btn-sm">
              <span>View Storefront</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div style={{ padding: '2rem', flexGrow: 1, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'overview' && (
            <AdminOverview
              token={token}
              setActiveTab={setActiveTab}
              onAddNewProduct={handleAddNew}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              loading={loadingProducts}
              onRefresh={fetchAdminProducts}
              onAddNew={handleAddNew}
              onEditProduct={handleEdit}
              token={token}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders token={token} />
          )}

          {activeTab === 'wordpress' && (
            <AdminWordpressImport
              token={token}
              onProductUpdated={fetchAdminProducts}
            />
          )}
        </div>
      </main>

      {/* Product Add/Edit Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSave={fetchAdminProducts}
        token={token}
      />

      <style>{`
        @media (max-width: 800px) {
          .admin-sidebar {
            width: 72px !important;
          }
          .admin-sidebar span, .admin-sidebar .font-royal {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
