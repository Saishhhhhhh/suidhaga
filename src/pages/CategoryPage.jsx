import React, { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, Filter, SlidersHorizontal, MessageCircle, ChevronRight, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function CategoryPage({
  activeCategory = 'Ethnic Wear',
  onSelectCategory,
  onBackToHome,
  onOpenProduct,
}) {
  const { products, loading } = useShop();

  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under2500' | '2500to5000' | 'above5000'
  const [selectedSubtype, setSelectedSubtype] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');

  // Category Configuration Data
  const categoryConfigs = {
    'Ethnic Wear': {
      title: 'Ethnic Wear Couture',
      tagline: 'Timeless Indian Grace & Handcrafted Embroidery',
      description: 'Immerse yourself in centuries of royal artisan craft. From royal Chanderi anarkalis and Banarasi silk kurta sets to festive bridal lehengas, each silhouette is tailored with pure devotion.',
      bannerImage: '/assets/ethenic.webp',
      badge: 'HERITAGE EDIT 2026',
      subtypes: ['All', 'Anarkali Set', 'Kurta Set', 'Lehenga', 'Sharara Suit', 'Saree'],
    },
    'Travel Ready': {
      title: 'Travel Ready Outfits',
      tagline: 'Effortless Resort Luxury & Breathable Co-ords',
      description: 'Engineered for modern wanderlust. Lightweight, wrinkle-resistant luxury sets and flowing silhouettes that move gracefully with you from sunrise flight to sunset dinner.',
      bannerImage: '/assets/travel.webp',
      badge: 'RESORT & TRAVEL LUXURY',
      subtypes: ['All', 'Co-ord Set', 'Travel Kaftan', 'Linen Tunic', 'Resort Dress'],
    },
    'Shirts': {
      title: 'Artisanal Tailored Shirts',
      tagline: 'Hand-block Printed Cotton & Silk Statements',
      description: 'The pinnacle of everyday elegance. Breathable pure cottons and silk blends adorned with delicate hand-finished needlework, mandarin collars, and versatile tailoring.',
      bannerImage: '/assets/shirts.webp',
      badge: 'EVERYDAY ARTISANAL CHIC',
      subtypes: ['All', 'Cotton Shirt', 'Silk Blend Shirt', 'Tunic', 'Casual Chic'],
    },
    'Indo-Western': {
      title: 'Indo-Western Couture',
      tagline: 'Modern Fusion Silhouettes & Contemporary Capes',
      description: 'A daring harmony of Indian craftsmanship and modern global fashion. Featuring architectural capes, pre-draped contemporary sarees, and statement fusion coordinates.',
      bannerImage: '/assets/indowest.webp',
      badge: 'CONTEMPORARY FUSION',
      subtypes: ['All', 'Cape Set', 'Draped Saree', 'Dhoti Set', 'Crop Top & Palazzo'],
    },
  };

  const currentConfig = categoryConfigs[activeCategory] || {
    title: `${activeCategory} Collection`,
    tagline: 'Handcrafted Designer Fashion by Komal',
    description: 'Explore our latest signature silhouettes handcrafted with high quality fabrics and intricate needlework.',
    bannerImage: '/assets/hero_banner.jpg',
    badge: 'EXCLUSIVE ATELIER',
    subtypes: ['All'],
  };

  const allCategories = ['Ethnic Wear', 'Travel Ready', 'Shirts', 'Indo-Western'];

  // Filter products for this specific category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = p.category?.toLowerCase() === activeCategory.toLowerCase();
      if (!matchCat) return false;

      // Price filter
      if (priceFilter === 'under2500' && p.price >= 2500) return false;
      if (priceFilter === '2500to5000' && (p.price < 2500 || p.price > 5000)) return false;
      if (priceFilter === 'above5000' && p.price <= 5000) return false;

      // Subtype / Keyword filter
      if (selectedSubtype !== 'all') {
        const textToSearch = `${p.title} ${p.tags?.join(' ') || ''}`.toLowerCase();
        if (!textToSearch.includes(selectedSubtype.toLowerCase().replace(' set', '').replace(' suit', ''))) {
          return false;
        }
      }

      // Size filter
      if (selectedSize !== 'all' && p.sizes && !p.sizes.includes(selectedSize)) {
        return false;
      }

      return true;
    });
  }, [products, activeCategory, priceFilter, selectedSubtype, selectedSize]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...categoryProducts].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'bestseller') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      return 0; // featured
    });
  }, [categoryProducts, sortBy]);

  return (
    <div style={{ backgroundColor: 'var(--ivory-base)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Category Hero Banner */}
      <section
        style={{
          position: 'relative',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(to right, rgba(28, 5, 12, 0.92) 0%, rgba(54, 7, 18, 0.78) 50%, rgba(54, 7, 18, 0.45) 100%), url('${currentConfig.bannerImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          color: '#ffffff',
          padding: '3.5rem 1.5rem',
          borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '680px' }}>
            
            {/* Breadcrumb Navigation */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: '#e5c378',
                marginBottom: '1rem',
              }}
            >
              <button
                onClick={onBackToHome}
                style={{ background: 'none', border: 'none', color: '#e5c378', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Home
              </button>
              <ChevronRight size={13} />
              <span>Collections</span>
              <ChevronRight size={13} />
              <strong style={{ color: '#ffffff' }}>{activeCategory}</strong>
            </div>

            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#f7dc98',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '0.75rem',
                display: 'block',
                width: 'fit-content',
              }}
            >
              {currentConfig.badge}
            </div>

            {/* Main Category Title */}
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '0.8rem',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              {currentConfig.title}
            </h1>

            <p style={{ color: '#f3e8eb', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '580px' }}>
              {currentConfig.description}
            </p>

            {/* Quick Stat Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Sparkles size={14} color="#ffd700" />
              <span>{categoryProducts.length} Artisanal Designs in this Category</span>
            </div>

          </div>
        </div>
      </section>

      {/* Main Category Page Content Container */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        
        {/* Category Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {allCategories.map((catName) => {
            const isSelected = catName === activeCategory;
            return (
              <button
                key={catName}
                onClick={() => {
                  onSelectCategory(catName);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1.5px solid var(--maroon-800)' : '1px solid #dcd1c6',
                  backgroundColor: isSelected ? 'var(--maroon-800)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-dark)',
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 15px rgba(107, 29, 47, 0.2)' : 'none',
                }}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Filter and Sorting Controls Toolbar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(107, 29, 47, 0.12)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px rgba(107, 29, 47, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Top Row: Subtypes & Sort */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Subtypes Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maroon-900)', marginRight: '0.3rem' }}>
                Style:
              </span>
              {currentConfig.subtypes.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubtype(sub.toLowerCase())}
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedSubtype === sub.toLowerCase() ? '1px solid var(--maroon-800)' : '1px solid #e2d9d0',
                    backgroundColor: selectedSubtype === sub.toLowerCase() ? '#faf2f4' : '#ffffff',
                    color: selectedSubtype === sub.toLowerCase() ? 'var(--maroon-900)' : 'var(--text-medium)',
                    fontSize: '0.78rem',
                    fontWeight: selectedSubtype === sub.toLowerCase() ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={15} color="var(--maroon-800)" />
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              >
                <option value="featured">Featured / Curated</option>
                <option value="newest">New Arrivals</option>
                <option value="bestseller">Bestsellers</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Price & Size filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #f2ece6', paddingTop: '0.85rem' }}>
            
            {/* Price Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maroon-900)', marginRight: '0.3rem' }}>
                Price:
              </span>
              {[
                { label: 'All Prices', val: 'all' },
                { label: 'Under ₹2,500', val: 'under2500' },
                { label: '₹2,500 - ₹5,000', val: '2500to5000' },
                { label: '₹5,000+', val: 'above5000' },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setPriceFilter(p.val)}
                  style={{
                    padding: '0.25rem 0.7rem',
                    borderRadius: 'var(--radius-full)',
                    border: priceFilter === p.val ? '1px solid var(--gold-600)' : '1px solid #e7ded4',
                    backgroundColor: priceFilter === p.val ? '#fdfaf2' : '#ffffff',
                    color: priceFilter === p.val ? '#9e7920' : 'var(--text-medium)',
                    fontSize: '0.78rem',
                    fontWeight: priceFilter === p.val ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Size Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maroon-900)', marginRight: '0.2rem' }}>
                Size:
              </span>
              {['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    width: sz === 'all' ? 'auto' : '32px',
                    height: '28px',
                    padding: sz === 'all' ? '0 0.6rem' : 0,
                    borderRadius: 'var(--radius-sm)',
                    border: selectedSize === sz ? '1.5px solid var(--maroon-800)' : '1px solid #dcd1c6',
                    backgroundColor: selectedSize === sz ? 'var(--maroon-800)' : '#ffffff',
                    color: selectedSize === sz ? '#ffffff' : 'var(--text-dark)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {sz === 'all' ? 'All' : sz}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p>Curating your {activeCategory} collection...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed #dcd1c6',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✨</div>
            <h3 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--maroon-900)', marginBottom: '0.5rem' }}>
              No Outfits Found in this Filter
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Try clearing the price or style filters to view all handcrafted {activeCategory} outfits.
            </p>
            <button
              onClick={() => {
                setPriceFilter('all');
                setSelectedSubtype('all');
                setSelectedSize('all');
              }}
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className="category-products-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {sortedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} onOpenProduct={onOpenProduct} />
            ))}
          </div>
        )}

        {/* Bottom Bespoke Concierge Callout */}
        <div
          style={{
            marginTop: '4.5rem',
            backgroundColor: '#26050e',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 12px 35px rgba(38, 5, 14, 0.25)',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                color: '#d4af37',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Custom Bespoke Tailoring
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
                fontWeight: 700,
                marginBottom: '0.8rem',
                color: '#ffffff',
              }}
            >
              Need a Custom Size or Color in {activeCategory}?
            </h3>

            <p style={{ color: '#eed9de', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Every outfit can be tailored to your precise measurements by founder Komal. We craft with extra fabric margins for effortless future adjustments.
            </p>

            <a
              href={`https://wa.me/919773001771?text=${encodeURIComponent(
                `Hi Komal! I am browsing the ${activeCategory} collection on Sui-Dhaga and would love some guidance on custom measurements and sizing.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <MessageCircle size={18} color="#25D366" />
              <span>Connect with Komal on WhatsApp (+91 97730 01771)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
