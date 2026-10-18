import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CollectionGrid from './components/CollectionGrid';
import ProductCatalog from './components/ProductCatalog';
import FounderStory from './components/FounderStory';
import WhySuiDhaga from './components/WhySuiDhaga';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import WhatsAppFloat from './components/WhatsAppFloat';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';

function MainApp() {
  const { notification } = useShop();

  // Route state
  const [currentView, setCurrentView] = useState(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'shop';
  });

  // Admin Auth state
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('suidhaga_admin_token') || null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = localStorage.getItem('suidhaga_admin_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  // Handle URL history state
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(window.location.pathname.startsWith('/admin') ? 'admin' : 'shop');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (user, token) => {
    setAdminUser(user);
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('suidhaga_admin_token');
    localStorage.removeItem('suidhaga_admin_user');
    setAdminToken(null);
    setAdminUser(null);
    navigateTo('shop');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            backgroundColor: notification.type === 'error' ? '#dc2626' : 'var(--maroon-900)',
            color: '#ffffff',
            padding: '0.65rem 1.4rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            border: '1px solid var(--border-gold)',
            fontSize: '0.88rem',
            fontWeight: 600,
            animation: 'fadeIn 0.25s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>{notification.msg}</span>
        </div>
      )}

      {currentView === 'admin' ? (
        adminToken ? (
          <AdminLayout
            adminUser={adminUser}
            token={adminToken}
            onLogout={handleAdminLogout}
            onBackToStore={() => navigateTo('shop')}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToStore={() => navigateTo('shop')}
          />
        )
      ) : (
        /* Customer Storefront View */
        <>
          <AnnouncementBar />
          <Header currentView={currentView} setCurrentView={navigateTo} />
          
          <main style={{ flexGrow: 1 }}>
            <HeroSection />
            <CollectionGrid />
            <ProductCatalog />
            <FounderStory />
            <WhySuiDhaga />
          </main>

          <Footer setCurrentView={navigateTo} />

          {/* Modals & Drawers */}
          <CartDrawer />
          <ProductQuickView />
          <CheckoutModal />
          <OrderTrackerModal />
          <WhatsAppFloat />
        </>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}
