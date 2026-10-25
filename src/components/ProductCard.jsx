import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, MessageCircle, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product, onOpenProduct }) {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useShop();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');

  const isWishlisted = wishlist.includes(product._id);
  const primaryImage = product.images?.[0] || '/assets/maroon_anarkali.jpg';
  const isSoldOut = product.stock !== undefined ? Number(product.stock) <= 0 : false;

  const handleClickProduct = () => {
    if (onOpenProduct) {
      onOpenProduct(product);
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleWhatsAppEnquiry = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hello Komal! I'm interested in "${product.title}" (₹${product.price}). Is it available in size ${selectedSize}?`
    );
    window.open(`https://wa.me/919773001771?text=${text}`, '_blank');
  };

  return (
    <div className="card-luxury" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          paddingTop: '135%', // 3:4 portrait ratio
          overflow: 'hidden',
          backgroundColor: '#f3ece7',
          cursor: 'pointer',
        }}
        onClick={handleClickProduct}
      >
        <img
          src={primaryImage}
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            filter: isSoldOut ? 'grayscale(30%)' : 'none',
          }}
          className="product-img"
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            zIndex: 2,
          }}
        >
          {isSoldOut ? (
            <span
              style={{
                backgroundColor: '#1f2937',
                color: '#ffffff',
                border: '1px solid #4b5563',
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
              Sold Out
            </span>
          ) : (
            <>
              {product.discount > 0 && (
                <span className="badge-sale">{product.discount}% OFF</span>
              )}
              {product.isBestseller && (
                <span className="badge-gold">Bestseller</span>
              )}
              {product.isNewArrival && (
                <span className="badge-maroon">New Launch</span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 2,
            transition: 'all 0.2s',
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={18}
            color={isWishlisted ? '#c23b4b' : '#6b1d2f'}
            fill={isWishlisted ? '#c23b4b' : 'none'}
          />
        </button>

        {/* Quick View Overlay on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="quick-view-overlay-btn"
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            color: 'var(--maroon-800)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-full)',
            padding: '0.5rem 1.2rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}
        >
          <Eye size={15} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Category & Fabric */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8c6913', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {product.category}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {product.fabric || 'Pure Silk Blend'}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={handleClickProduct}
          className="font-display"
          style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.title}
        </h3>

        {/* Rating stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} fill="#d4af37" color="#d4af37" />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>(4.9)</span>
        </div>

        {/* Price & MRP */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--maroon-800)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ marginBottom: '1.1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
              Select Size:
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    border: selectedSize === sz ? '1.5px solid var(--maroon-800)' : '1px solid #dcd4ce',
                    backgroundColor: selectedSize === sz ? 'var(--maroon-800)' : '#ffffff',
                    color: selectedSize === sz ? '#ffffff' : 'var(--text-dark)',
                    borderRadius: '4px',
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions Button Row */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => !isSoldOut && addToCart(product, selectedSize, 1)}
            disabled={isSoldOut}
            className="btn btn-primary btn-sm"
            style={{
              flexGrow: 1,
              padding: '0.65rem 0.8rem',
              opacity: isSoldOut ? 0.65 : 1,
              cursor: isSoldOut ? 'not-allowed' : 'pointer',
              backgroundColor: isSoldOut ? '#4b5563' : undefined,
              borderColor: isSoldOut ? '#4b5563' : undefined,
            }}
          >
            <ShoppingBag size={15} />
            <span>{isSoldOut ? 'Sold Out' : 'Add to Bag'}</span>
          </button>

          <button
            onClick={handleWhatsAppEnquiry}
            style={{
              backgroundColor: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
              transition: 'transform 0.2s',
            }}
            title="Enquire on WhatsApp"
          >
            <MessageCircle size={18} />
          </button>
        </div>

      </div>

      <style>{`
        .card-luxury:hover .product-img {
          transform: scale(1.05);
        }
        .quick-view-overlay-btn {
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .card-luxury:hover .quick-view-overlay-btn {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
