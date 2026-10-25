import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import DiwaliBanner from './components/DiwaliBanner';
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
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import { getProductSlug } from './utils/slug';

const slugToCategory = {
  'ethnic-wear': 'Ethnic Wear',
  'travel-ready': 'Travel Ready',
  'shirts': 'Shirts',
  'indo-western': 'Indo-Western',
};

const categoryToSlug = {
  'Ethnic Wear': 'ethnic-wear',
  'Travel Ready': 'travel-ready',
  'Shirts': 'shirts',
  'Indo-Western': 'indo-western',
};

function parseCurrentRoute() {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) {
    const rawTab = path.replace(/^\/admin\/?/, '').split('/')[0] || '';
    const validTabs = ['overview', 'categories', 'products', 'orders', 'phonepe', 'wordpress'];
    const adminTab = validTabs.includes(rawTab) ? rawTab : 'overview';
    return { view: 'admin', adminTab };
  }
  if (path.startsWith('/category/')) {
    const slug = path.replace('/category/', '').replace(/\/$/, '');
    const catName = slugToCategory[slug] || 'Ethnic Wear';
    return { view: 'category', category: catName };
  }
  if (path.startsWith('/product/')) {
    const slugOrId = decodeURIComponent(path.replace('/product/', '').replace(/\/$/, ''));
    return { view: 'product', productSlugOrId: slugOrId };
  }
  if (path.startsWith('/payment-callback') || path.startsWith('/payment-status')) {
    return { view: 'payment-callback' };
  }
  if (path.startsWith('/our-story') || path.startsWith('/story')) {
    return { view: 'story' };
  }
  return { view: 'shop' };
}

function MainApp() {
  const { notification, setSelectedCategory, products } = useShop();

  // Multi-page route state: { view, category?, productId? }
  const [route, setRoute] = useState(() => parseCurrentRoute());

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

  // Handle browser back/forward buttons with real URL updates
  useEffect(() => {
    const handlePopState = () => {
      const newRoute = parseCurrentRoute();
      setRoute(newRoute);
      if (newRoute.category) {
        setSelectedCategory(newRoute.category);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setSelectedCategory]);

  // Route Navigation Handlers
  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setRoute({ view: 'shop' });
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catName) => {
    const slug = categoryToSlug[catName] || 'ethnic-wear';
    window.history.pushState({}, '', `/category/${slug}`);
    setRoute({ view: 'category', category: catName });
    setSelectedCategory(catName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productOrSlugOrId) => {
    let slug = '';
    if (typeof productOrSlugOrId === 'object' && productOrSlugOrId !== null) {
      slug = getProductSlug(productOrSlugOrId);
    } else if (typeof productOrSlugOrId === 'string') {
      const found = products.find(
        (p) => p._id === productOrSlugOrId || p.slug === productOrSlugOrId
      );
      slug = found ? getProductSlug(found) : productOrSlugOrId;
    }
    window.history.pushState({}, '', `/product/${slug}`);
    setRoute({ view: 'product', productSlugOrId: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStory = () => {
    window.history.pushState({}, '', '/our-story');
    setRoute({ view: 'story' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = (tab = 'overview') => {
    const targetUrl = tab === 'overview' ? '/admin' : `/admin/${tab}`;
    window.history.pushState({}, '', targetUrl);
    setRoute({ view: 'admin', adminTab: tab });
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
    navigateToHome();
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

      {route.view === 'admin' ? (
        adminToken ? (
          <AdminLayout
            adminUser={adminUser}
            token={adminToken}
            initialTab={route.adminTab || 'overview'}
            onNavigateTab={(tab) => setRoute({ view: 'admin', adminTab: tab })}
            onLogout={handleAdminLogout}
            onBackToStore={navigateToHome}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToStore={navigateToHome}
          />
        )
      ) : (
        /* Customer Multi-page Storefront View */
        <>
          <AnnouncementBar />
          <Header
            currentView={route.view}
            activeCategory={route.category}
            onNavigateHome={navigateToHome}
            onOpenCategory={navigateToCategory}
            onOpenStory={navigateToStory}
          />
          
          <main style={{ flexGrow: 1 }}>
            {route.view === 'payment-callback' ? (
              <PaymentCallbackPage
                onNavigateHome={navigateToHome}
                onOpenTracker={() => setOrderTrackerOpen(true)}
              />
            ) : route.view === 'category' ? (
              <CategoryPage
                activeCategory={route.category}
                onSelectCategory={navigateToCategory}
                onBackToHome={navigateToHome}
                onOpenProduct={navigateToProduct}
              />
            ) : route.view === 'product' ? (
              <ProductDetailPage
                productSlugOrId={route.productSlugOrId}
                onNavigateHome={navigateToHome}
                onNavigateCategory={navigateToCategory}
                onNavigateProduct={navigateToProduct}
              />
            ) : route.view === 'story' ? (
              <div style={{ padding: '3rem 0' }}>
                <FounderStory />
                <WhySuiDhaga />
              </div>
            ) : (
              /* Home Page */
              <>
                <HeroSection />
                <DiwaliBanner />
                <CollectionGrid onOpenCategory={navigateToCategory} />
                <ProductCatalog
                  onOpenProduct={navigateToProduct}
                  onOpenCategory={navigateToCategory}
                />
                <FounderStory />
                <WhySuiDhaga />
              </>
            )}
          </main>

          <Footer
            setCurrentView={(v) => v === 'admin' ? navigateToAdmin() : navigateToHome()}
            onOpenCategory={navigateToCategory}
          />

          {/* Modals & Drawers */}
          <CartDrawer />
          <ProductQuickView onOpenProduct={navigateToProduct} />
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
