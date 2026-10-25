import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
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
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // The 4 official brand collections + All
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
    const el = document.getElementById('collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
        backgroundColor: 'rgba(253, 251, 247, 0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
        boxShadow: '0 4px 25px -4px rgba(107, 29, 47, 0.05)',
        transition: 'all 0.3s ease',
      }}
      className="luxury-header"
    >
      <div className="container" style={{ padding: '0.85rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--maroon-800)',
              padding: '0.3rem',
            }}
            className="mobile-toggle-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Left: Brand Identity with Authentic Logo */}
          <div
            onClick={() => {
              setCurrentView('shop');
              setSelectedCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            className="brand-logo-container"
          >
            <img
              src="/assets/logo.webp"
              alt="Sui Dhaga Logo"
              style={{
                height: '50px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(107, 29, 47, 0.12))',
                transition: 'transform 0.3s ease',
              }}
              className="brand-logo-img"
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderLeft: '1px solid rgba(107, 29, 47, 0.14)',
                paddingLeft: '0.9rem',
              }}
              className="brand-text-block"
            >
              <span
                className="font-royal"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--maroon-900)',
                  letterSpacing: '0.14em',
                  lineHeight: 1.1,
                }}
              >
                SUI-DHAGA
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.22em',
                  color: '#9e7920',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginTop: '0.15rem',
                }}
              >
                by Komal • Couture
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.9rem',
            }}
            className="desktop-nav"
          >
            {displayCategories.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryClick(cat.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? 'var(--maroon-800)' : '#443538',
                    cursor: 'pointer',
                    padding: '0.55rem 0',
                    position: 'relative',
                    letterSpacing: '0.03em',
                    transition: 'color 0.25s ease',
                  }}
                  className="nav-link-btn"
                >
                  {cat.label}
                  {isSelected && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #d4af37 0%, #b8912e 100%)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>
              );
            })}

            <button
              onClick={handleStoryClick}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: '#443538',
                cursor: 'pointer',
                padding: '0.55rem 0',
                letterSpacing: '0.03em',
                transition: 'color 0.25s ease',
              }}
              className="nav-link-btn"
            >
              Our Story
            </button>
          </nav>

          {/* Right: Sleek Search, Wishlist, Cart & Admin Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Minimal Luxury Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: searchFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                border: searchFocused ? '1.5px solid #d4af37' : '1px solid rgba(107, 29, 47, 0.16)',
                borderRadius: 'var(--radius-full)',
                padding: '0.42rem 0.95rem',
                gap: '0.5rem',
                boxShadow: searchFocused ? '0 0 0 3px rgba(212, 175, 55, 0.16)' : 'none',
                transition: 'all 0.25s ease',
              }}
              className="desktop-search-box"
            >
              <Search size={15} color="var(--maroon-700)" />
              <input
                type="text"
                placeholder="Search kurtas, suits..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.83rem',
                  width: searchFocused ? '170px' : '135px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-dark)',
                  transition: 'width 0.25s ease',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#888',
                    padding: '0 0.15rem',
                  }}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Wishlist Circular Button */}
            <button
              onClick={() => {
                alert(`You have ${wishlist.length} saved favorites in your Wishlist!`);
              }}
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid rgba(107, 29, 47, 0.14)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--maroon-800)',
                transition: 'all 0.2s ease',
              }}
              className="action-icon-btn"
              title="My Wishlist"
            >
              <Heart size={18} color="var(--maroon-800)" />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: 'var(--maroon-700)',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #ffffff',
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Luxury Pill */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(107, 29, 47, 0.18)',
                borderRadius: 'var(--radius-full)',
                padding: '0.42rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 10px rgba(107, 29, 47, 0.04)',
              }}
              className="action-cart-btn"
              title="Shopping Bag"
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ShoppingBag size={18} color="var(--maroon-800)" />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-7px',
                      right: '-8px',
                      backgroundColor: 'var(--maroon-800)',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      width: '16px',
                      height: '16px',
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

            {/* Discreet Luxury Admin Concierge Badge */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'shop' : 'admin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: currentView === 'admin' ? 'var(--maroon-800)' : 'rgba(212, 175, 55, 0.08)',
                color: currentView === 'admin' ? '#ffffff' : 'var(--maroon-900)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: 'var(--radius-full)',
                padding: '0.42rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="admin-badge-btn"
              title="Admin Portal"
            >
              <ShieldCheck size={14} color="#d4af37" />
              <span>{currentView === 'admin' ? 'Storefront' : 'Admin'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.25rem 0',
              borderTop: '1px solid rgba(107, 29, 47, 0.1)',
              marginTop: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <input
                type="text"
                placeholder="Search kurtas, suits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ padding: '0.6rem 0.95rem', fontSize: '0.88rem' }}
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
                  padding: '0.4rem 0',
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
                padding: '0.4rem 0',
              }}
            >
              Our Story
            </button>
          </div>
        )}
      </div>

      <style>{`
        .brand-logo-img:hover {
          transform: scale(1.04);
        }
        .nav-link-btn:hover {
          color: var(--maroon-800) !important;
        }
        .action-icon-btn:hover {
          background-color: var(--maroon-50) !important;
          border-color: rgba(107, 29, 47, 0.3) !important;
          transform: translateY(-1px);
        }
        .action-cart-btn:hover {
          background-color: var(--maroon-50) !important;
          border-color: rgba(107, 29, 47, 0.35) !important;
          transform: translateY(-1px);
        }
        .admin-badge-btn:hover {
          background-color: var(--maroon-800) !important;
          color: #ffffff !important;
          border-color: var(--maroon-800) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 990px) {
          .desktop-nav { display: none !important; }
          .desktop-search-box { display: none !important; }
          .mobile-toggle-btn { display: block !important; }
          .cart-subtotal-text { display: none !important; }
        }
        @media (max-width: 580px) {
          .brand-text-block { display: none !important; }
        }
      `}</style>
    </header>
  );
}
