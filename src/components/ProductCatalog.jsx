import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, Flame, Compass } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';

export default function ProductCatalog() {
  const {
    products,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
  } = useShop();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'bestsellers' | 'new'
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All',
    'Anarkalis',
    'Kurtas & Sets',
    'Indo-Western',
    'Lehengas',
    'Sarees',
  ];

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

  return (
    <section id="collection-section" style={{ padding: '4rem 0 5rem', backgroundColor: 'var(--ivory-base)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--gold-600)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={14} />
            <span>The Festive Couture Collection</span>
          </div>

          <h2
            className="font-display maroon-gradient-text"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 700, marginBottom: '0.6rem' }}
          >
            {selectedCategory === 'All' ? 'Signature Handcrafted Outfits' : selectedCategory}
          </h2>

          <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : 'Rooted in Indian traditions, tailored with love. Explore our latest ready-to-ship ethnic silhouettes.'}
          </p>
        </div>

        {/* Category Filter Pills Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                border: selectedCategory === cat ? '1.5px solid var(--maroon-800)' : '1px solid #dcd3cb',
                backgroundColor: selectedCategory === cat ? 'var(--maroon-800)' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-dark)',
                fontSize: '0.85rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(107, 29, 47, 0.2)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-Filters & Sort Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(107, 29, 47, 0.12)',
            paddingBottom: '1rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Sub Filters */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

        {/* Loading Skeleton */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="card-luxury"
                style={{ height: '420px', backgroundColor: '#efe7df', opacity: 0.6 }}
              />
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && sorted.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '2rem',
            }}
          >
            {sorted.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
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
              Try clearing your search query or selecting "All Collections".
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
    </section>
  );
}
