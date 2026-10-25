import React, { useState, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowRight, Compass } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';

export default function ProductCatalog({ onOpenProduct, onOpenCategory }) {
  const {
    products,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
  } = useShop();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'bestsellers' | 'new'
  const [sortBy, setSortBy] = useState('featured');
  const sliderRef = useRef(null);

  const categories = ['All', 'Ethnic Wear', 'Travel Ready', 'Shirts', 'Indo-Western'];

  // Filtering
  const filtered = products.filter((p) => {
    if (activeFilter === 'bestsellers' && !p.isBestseller) return false;
    if (activeFilter === 'new' && !p.isNewArrival) return false;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
    return 0;
  });

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="collection-section" style={{ padding: '4.5rem 0 5rem', backgroundColor: 'var(--ivory-base)', overflow: 'hidden' }}>
      <div className="container">
        
        {/* Section Header with Slider Navigation Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
          className="catalog-header-bar"
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--gold-600)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
              className="catalog-badge"
            >
              <Sparkles size={14} color="#d4af37" />
              <span>The Festive Couture Collection</span>
            </div>

            <h2
              className="font-display maroon-gradient-text catalog-title"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 700, lineHeight: 1.2 }}
            >
              Signature Handcrafted Outfits
            </h2>

            <p className="catalog-subtitle" style={{ color: 'var(--text-medium)', fontSize: '0.94rem', marginTop: '0.4rem', maxWidth: '580px' }}>
              {searchQuery
                ? `Showing handcrafted matches for "${searchQuery}"`
                : 'Slide through our ready-to-ship royal anarkalis, festive kurta sets, breezy vacation co-ords, and tailored cotton shirts.'}
            </p>
          </div>

          {/* Slider Prev / Next Arrows */}
          <div className="slider-nav-arrows" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => scrollSlider('left')}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1.5px solid rgba(107, 29, 47, 0.2)',
                color: 'var(--maroon-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
              }}
              className="slider-nav-btn"
              title="Previous Outfits"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={() => scrollSlider('right')}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--maroon-800)',
                border: '1.5px solid var(--maroon-800)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(107, 29, 47, 0.25)',
                transition: 'all 0.2s',
              }}
              className="slider-nav-btn"
              title="Next Outfits"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div
          className="category-pills-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            marginBottom: '1.75rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="category-pill-btn"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                border: selectedCategory === cat ? '1.5px solid var(--maroon-800)' : '1px solid #dcd3cb',
                backgroundColor: selectedCategory === cat ? 'var(--maroon-800)' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-dark)',
                fontSize: '0.84rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(107, 29, 47, 0.2)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-Filters & Sort Bar */}
        <div
          className="catalog-subfilter-bar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(107, 29, 47, 0.1)',
            paddingBottom: '0.85rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Sub Filters */}
          <div className="catalog-subfilters-group" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: activeFilter === 'all' ? 700 : 500,
                color: activeFilter === 'all' ? 'var(--maroon-800)' : 'var(--text-muted)',
                cursor: 'pointer',
                textDecoration: activeFilter === 'all' ? 'underline' : 'none',
              }}
            >
              All Outfits ({products.length})
            </button>

            <span style={{ color: '#ccc' }}>•</span>

            <button
              onClick={() => setActiveFilter('bestsellers')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: activeFilter === 'bestsellers' ? 700 : 500,
                color: activeFilter === 'bestsellers' ? 'var(--maroon-800)' : 'var(--text-muted)',
                cursor: 'pointer',
                textDecoration: activeFilter === 'bestsellers' ? 'underline' : 'none',
              }}
            >
              🔥 Bestsellers
            </button>

            <span style={{ color: '#ccc' }}>•</span>

            <button
              onClick={() => setActiveFilter('new')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: activeFilter === 'new' ? 700 : 500,
                color: activeFilter === 'new' ? 'var(--maroon-800)' : 'var(--text-muted)',
                cursor: 'pointer',
                textDecoration: activeFilter === 'new' ? 'underline' : 'none',
              }}
            >
              ✨ New Launches
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="catalog-sort-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={14} color="var(--maroon-800)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-medium)', fontWeight: 600 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', width: 'auto' }}
            >
              <option value="featured">Featured Collection</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'hidden' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="card-luxury"
                style={{ flex: '0 0 290px', height: '420px', backgroundColor: '#efe7df', opacity: 0.6 }}
              />
            ))}
          </div>
        )}

        {/* Product Cards Slider (Horizontal Scroll Track) */}
        {!loading && sorted.length > 0 && (
          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              gap: '1.75rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '0.5rem 0.25rem 1.5rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="product-slider-scroll"
          >
            {sorted.map((prod) => (
              <div
                key={prod._id}
                style={{
                  flex: '0 0 295px',
                  scrollSnapAlign: 'start',
                }}
              >
                <ProductCard product={prod} onOpenProduct={onOpenProduct} />
              </div>
            ))}

            {/* Final Slide: Explore Full Category Card */}
            {selectedCategory !== 'All' && onOpenCategory && (
              <div
                onClick={() => onOpenCategory(selectedCategory)}
                style={{
                  flex: '0 0 250px',
                  scrollSnapAlign: 'start',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1.5px dashed var(--border-gold)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                }}
                className="view-more-slide"
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--maroon-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    color: 'var(--maroon-800)',
                  }}
                >
                  <ArrowRight size={24} />
                </div>
                <h4 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--maroon-900)', marginBottom: '0.5rem' }}>
                  Explore All in {selectedCategory}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  View complete collection with advanced filters
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Compass size={44} color="var(--maroon-800)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
            <h3 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              No outfits found in this selection
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Try selecting "All Collections" to see our signature outfits.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveFilter('all');
              }}
              className="btn btn-outline"
            >
              View All Collections
            </button>
          </div>
        )}

      </div>

      <style>{`
        .product-slider-scroll::-webkit-scrollbar {
          display: none;
        }
        .slider-nav-btn:hover {
          transform: scale(1.06);
        }
        .view-more-slide:hover {
          border-color: var(--maroon-800) !important;
          background-color: var(--maroon-50) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .catalog-header-bar {
            margin-bottom: 0.85rem !important;
            gap: 0.6rem !important;
          }
          .catalog-badge {
            font-size: 0.7rem !important;
            margin-bottom: 0.25rem !important;
          }
          .catalog-title {
            font-size: 1.5rem !important;
            line-height: 1.18 !important;
          }
          .catalog-subtitle {
            font-size: 0.8rem !important;
            line-height: 1.35 !important;
            margin-top: 0.25rem !important;
          }
          .slider-nav-arrows {
            gap: 0.5rem !important;
          }
          .slider-nav-btn {
            width: 36px !important;
            height: 36px !important;
          }
          .slider-nav-btn svg {
            width: 17px !important;
            height: 17px !important;
          }

          /* Single row horizontal scroll for category tabs on mobile */
          .category-pills-bar {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            padding-bottom: 0.45rem !important;
            margin-bottom: 0.9rem !important;
            gap: 0.45rem !important;
          }
          .category-pills-bar::-webkit-scrollbar {
            display: none !important;
          }
          .category-pill-btn {
            padding: 0.35rem 0.85rem !important;
            font-size: 0.76rem !important;
            border-radius: 20px !important;
            flex-shrink: 0 !important;
          }

          /* Sub-filter row on mobile */
          .catalog-subfilter-bar {
            padding-bottom: 0.55rem !important;
            margin-bottom: 1rem !important;
            gap: 0.5rem !important;
          }
          .catalog-subfilters-group {
            overflow-x: auto !important;
            white-space: nowrap !important;
            scrollbar-width: none !important;
            gap: 0.5rem !important;
          }
          .catalog-subfilters-group::-webkit-scrollbar {
            display: none !important;
          }
          .catalog-subfilters-group button {
            font-size: 0.74rem !important;
          }
          .catalog-sort-group {
            font-size: 0.74rem !important;
          }
          .catalog-sort-group select {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.74rem !important;
          }
        }
      `}</style>
    </section>
  );
}
