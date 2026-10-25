import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Header({ currentView, setCurrentView, onOpenCategory, activeCategory }) {
  const {
    cartCount,
    setCartOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Clean 4 brand collections
  const navLinks = [
    { label: 'Ethnic Wear', value: 'Ethnic Wear' },
    { label: 'Travel Ready', value: 'Travel Ready' },
    { label: 'Shirts', value: 'Shirts' },
    { label: 'Indo-Western', value: 'Indo-Western' },
    { label: 'Our Story', value: 'story' },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    if (link.value === 'story') {
      if (currentView !== 'shop') {
        setCurrentView('shop');
      }
      setTimeout(() => {
        const el = document.getElementById('founder-story');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      setSelectedCategory(link.value);
      if (onOpenCategory) {
        onOpenCategory(link.value);
      } else {
        setCurrentView('category');
      }
    }
  };

  const handleLogoClick = () => {
    setCurrentView('shop');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.3s ease',
      }}
      className="luxury-header"
    >
      <div className="container" style={{ padding: '0.85rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px' }}>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--maroon-900)',
              padding: '0.3rem',
            }}
            className="mobile-toggle-btn"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Left: Authentic Brand Logo (Clean & Pure) */}
          <div
            onClick={handleLogoClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            title="Sui Dhaga Home"
          >
            <img
              src="/assets/logo.webp"
              alt="Sui Dhaga"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                transition: 'opacity 0.2s ease',
              }}
              className="brand-logo-img"
            />
          </div>

          {/* Center: Elegant, Airy Desktop Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.4rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => {
              const isSelected =
                item.value === 'story'
                  ? false
                  : currentView === 'category'
                  ? activeCategory === item.value
                  : selectedCategory === item.value && currentView === 'shop';

              return (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isSelected ? 'var(--maroon-800)' : '#332729',
                    cursor: 'pointer',
                    padding: '0.4rem 0',
                    position: 'relative',
                    transition: 'color 0.2s ease',
                  }}
                  className="nav-link-item"
                >
                  {item.label}
                  {isSelected && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: '0',
                        width: '100%',
                        height: '1.5px',
                        backgroundColor: '#d4af37',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Minimal Utility Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: searchOpen ? 'var(--maroon-800)' : '#443538',
                padding: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease',
              }}
              className="icon-action-btn"
              title="Search Outfits"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

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
                color: '#443538',
                padding: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease',
              }}
              className="icon-action-btn"
              title="My Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    backgroundColor: 'var(--maroon-700)',
                    color: '#ffffff',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    width: '15px',
                    height: '15px',
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

            {/* Shopping Bag Pill */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#443538',
                padding: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.2s ease',
              }}
              className="icon-action-btn"
              title="Shopping Bag"
            >
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: 'var(--maroon-800)',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--maroon-900)',
                }}
                className="cart-label-text"
              >
                Bag {cartCount > 0 && `(${cartCount})`}
              </span>
            </button>

          </div>
        </div>

        {/* Expandable Clean Search Bar Dropdown */}
        {searchOpen && (
          <div
            style={{
              padding: '1rem 0 0.5rem',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <Search size={18} color="var(--maroon-800)" />
            <input
              type="text"
              placeholder="Search handcrafted kurtas, anarkalis, shirts, lehengas..."
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                backgroundColor: 'transparent',
                color: 'var(--text-dark)',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: '#888',
                  padding: '0 0.5rem',
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.25rem 0 0.75rem',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {navLinks.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item)}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--maroon-900)',
                  padding: '0.4rem 0',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

      </div>

      <style>{`
        .brand-logo-img:hover {
          opacity: 0.88;
        }
        .nav-link-item:hover {
          color: var(--maroon-800) !important;
        }
        .icon-action-btn:hover {
          color: var(--maroon-800) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle-btn { display: block !important; }
          .cart-label-text { display: none !important; }
        }
      `}</style>
    </header>
  );
}
