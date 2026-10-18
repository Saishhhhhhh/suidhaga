import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Header({ currentView, setCurrentView }) {
  const {
    cartCount,
    cartSubtotal,
    setCartOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories: apiCategories,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // The 4 official brand collections
  const displayCategories = [
    { label: 'All Collections', value: 'All' },
    { label: 'Ethnic Wear', value: 'Ethnic Wear' },
    { label: 'Travel Ready', value: 'Travel Ready' },
    { label: 'Shirts', value: 'Shirts' },
    { label: 'Indo-Western', value: 'Indo-Western' },
  ];

  const handleCategoryClick = (catVal) => {
    setSelectedCategory(catVal);
    if (currentView !== 'shop') {
      setCurrentView('shop');
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const handleStoryClick = () => {
    if (currentView !== 'shop') {
      setCurrentView('shop');
    }
    setMobileMenuOpen(false);
    const storyEl = document.getElementById('founder-story');
    if (storyEl) {
      storyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'rgba(253, 251, 247, 0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(107, 29, 47, 0.12)',
        boxShadow: '0 2px 15px rgba(107, 29, 47, 0.05)',
      }}
    >
      <div className="container" style={{ padding: '0.6rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--maroon-800)',
            }}
            className="mobile-toggle-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo & Brand Name */}
          <div
            onClick={() => {
              setCurrentView('shop');
              setSelectedCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <img
              src="/assets/logo.webp"
              alt="Sui Dhaga Logo"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(107, 29, 47, 0.15))',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="font-royal"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--maroon-800)',
                  letterSpacing: '0.12em',
                  lineHeight: 1.1,
                }}
              >
                SUI-DHAGA
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  color: '#8c6913',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                by Komal • Ethnic Couture
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
            className="desktop-nav"
          >
            {displayCategories.slice(0, 7).map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === cat.value ? 700 : 500,
                  color: selectedCategory === cat.value ? 'var(--maroon-800)' : 'var(--text-medium)',
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  position: 'relative',
                  transition: 'color 0.2s',
                }}
              >
                {cat.label}
                {selectedCategory === cat.value && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '20%',
                      right: '20%',
                      height: '2px',
                      backgroundColor: 'var(--gold-500)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </button>
            ))}

            <button
              onClick={handleStoryClick}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--text-medium)',
                cursor: 'pointer',
                padding: '0.4rem 0',
              }}
            >
              Our Story
            </button>
          </nav>

          {/* Right Action Icons & Admin portal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Search Toggle / Box */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid rgba(107, 29, 47, 0.18)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.8rem',
                  gap: '0.4rem',
                }}
                className="desktop-search-box"
              >
                <Search size={16} color="var(--maroon-700)" />
                <input
                  type="text"
                  placeholder="Search kurtas, lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.82rem',
                    width: '150px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-dark)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#999' }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => {
                alert(`You have ${wishlist.length} saved favorites in your Wishlist!`);
              }}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--maroon-800)',
                padding: '0.4rem',
              }}
              title="My Wishlist"
            >
              <Heart size={21} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '0',
                    backgroundColor: 'var(--maroon-700)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--maroon-50)',
                border: '1px solid rgba(107, 29, 47, 0.2)',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Shopping Bag"
            >
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={20} color="var(--maroon-800)" />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-8px',
                      backgroundColor: 'var(--maroon-800)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      width: '17px',
                      height: '17px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #ffffff',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--maroon-900)',
                }}
                className="cart-subtotal-text"
              >
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </button>

            {/* Switch to Admin Portal Button */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'shop' : 'admin')}
              className={currentView === 'admin' ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}
              style={{
                fontSize: '0.78rem',
                padding: '0.45rem 0.85rem',
                gap: '0.35rem',
              }}
              title="Admin Portal"
            >
              <ShieldCheck size={14} color="#d4af37" />
              <span>{currentView === 'admin' ? 'View Store' : 'Admin Panel'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 0',
              borderTop: '1px solid rgba(107, 29, 47, 0.1)',
              marginTop: '0.6rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
              />
            </div>
            {displayCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: selectedCategory === cat.value ? 700 : 500,
                  color: selectedCategory === cat.value ? 'var(--maroon-800)' : 'var(--text-dark)',
                  padding: '0.3rem 0',
                }}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={handleStoryClick}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'var(--text-dark)',
                padding: '0.3rem 0',
              }}
            >
              Our Story
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .desktop-search-box { display: none !important; }
          .mobile-toggle-btn { display: block !important; }
          .cart-subtotal-text { display: none !important; }
        }
      `}</style>
    </header>
  );
}
