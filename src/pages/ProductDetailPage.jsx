import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Lock,
  ArrowRight,
  Check,
  Ruler,
  Star,
  Share2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({
  productId,
  onNavigateHome,
  onNavigateCategory,
  onNavigateProduct
}) {
  const { products, addToCart, wishlist, toggleWishlist, setCheckoutOpen } = useShop();

  // Find product from list or fallback
  const product = products.find((p) => p._id === productId) || products[0];

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('details');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || '/assets/maroon_anarkali.jpg');
      setSelectedSize(product.sizes?.[0] || 'M');
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, productId]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 className="font-display">Product Not Found</h2>
        <button onClick={onNavigateHome} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Collections
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product._id);
  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : ['/assets/maroon_anarkali.jpg'];

  const discountVal = product.discount || (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  const savingsVal = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    setCheckoutOpen(true);
  };

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hi Komal! I am looking at "${product.title}" (₹${product.price}) on Sui-Dhaga. Can you help me with measurements for size ${selectedSize}?`
    );
    window.open(`https://wa.me/919773001771?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Sui-Dhaga by Komal`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <div style={{ backgroundColor: 'var(--ivory-base)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* Breadcrumb Navigation Bar */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#ffffff', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <button
            onClick={onNavigateHome}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
          >
            Home
          </button>
          <ChevronRight size={13} />
          <button
            onClick={() => onNavigateCategory(product.category)}
            style={{ background: 'none', border: 'none', color: 'var(--maroon-800)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            {product.category}
          </button>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--text-dark)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
            {product.title}
          </span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          
          {/* Left Column: Visual Gallery */}
          <div>
            {/* Primary Featured Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#f3ece7',
                border: '1px solid rgba(107, 29, 47, 0.12)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                aspectRatio: '3/4',
              }}
            >
              <img
                src={selectedImage}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
              />

              {/* Floating Badges */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', zIndex: 2 }}>
                {discountVal > 0 && (
                  <span className="badge-sale" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                    {discountVal}% OFF
                  </span>
                )}
                {product.isBestseller && (
                  <span className="badge-gold" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                    Bestseller
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="badge-maroon" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                    Festive Edit
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product._id)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(107, 29, 47, 0.15)',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                  zIndex: 2,
                }}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} color={isWishlisted ? '#c23b4b' : '#6b1d2f'} fill={isWishlisted ? '#c23b4b' : 'none'} />
              </button>
            </div>

            {/* Gallery Thumbnails Strip */}
            {galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '74px',
                      height: '95px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === img ? '2px solid var(--maroon-800)' : '1px solid #dcd1c6',
                      opacity: selectedImage === img ? 1 : 0.65,
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Trust Badges Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '1.75rem',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(107, 29, 47, 0.08)',
                textAlign: 'center',
              }}
            >
              <div>
                <Sparkles size={20} color="var(--gold-600)" style={{ margin: '0 auto 0.35rem' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--maroon-900)' }}>100% Handcrafted</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Atelier needlework</div>
              </div>
              <div>
                <Truck size={20} color="var(--gold-600)" style={{ margin: '0 auto 0.35rem' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--maroon-900)' }}>Free Express Delivery</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Across India on ₹1999+</div>
              </div>
              <div>
                <RotateCcw size={20} color="var(--gold-600)" style={{ margin: '0 auto 0.35rem' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--maroon-900)' }}>Easy Exchange</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>7-day hassle-free</div>
              </div>
            </div>

          </div>

          {/* Right Column: Product Details & Purchase Actions */}
          <div>
            
            {/* Category Subtitle */}
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--gold-600)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              {product.category} • The Atelier Collection
            </div>

            {/* Grand Product Title */}
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1.22,
                color: 'var(--maroon-950)',
                marginBottom: '1rem',
              }}
            >
              {product.title}
            </h1>

            {/* Pricing Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--maroon-900)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>

              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: '1.25rem', color: '#999', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    Save ₹{savingsVal.toLocaleString('en-IN')} ({discountVal}% OFF)
                  </span>
                </>
              )}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginBottom: '1.5rem' }}>
              ✓ Inclusive of all taxes • Ready to dispatch
            </div>

            {/* Short Narrative Description */}
            <p style={{ color: 'var(--text-medium)', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              {product.description ||
                'Impeccably tailored with intricate artisanal handwork. Blending traditional Indian aesthetics with effortless modern comfort, this outfit features generous 2-inch inner fabric margins for personalized sizing adjustments.'}
            </p>

            {/* Size Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  Select Size: <strong style={{ color: 'var(--maroon-800)' }}>{selectedSize}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setSizeModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--maroon-800)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    textDecoration: 'underline',
                  }}
                >
                  <Ruler size={14} />
                  <span>Size Guide</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const isAvailable = !product.sizes || product.sizes.includes(sz);
                  const isSelected = selectedSize === sz;

                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        minWidth: '50px',
                        height: '44px',
                        padding: '0 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected
                          ? '2px solid var(--maroon-800)'
                          : isAvailable
                          ? '1px solid #dcd1c6'
                          : '1px dashed #ccc',
                        backgroundColor: isSelected
                          ? 'var(--maroon-800)'
                          : isAvailable
                          ? '#ffffff'
                          : '#f5f5f5',
                        color: isSelected ? '#ffffff' : isAvailable ? 'var(--text-dark)' : '#aaa',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.88rem',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                💡 <em>Includes 2-inch margin inside for easy alterations if needed.</em>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)' }}>Quantity:</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #dcd1c6',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#ffffff',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--maroon-800)',
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 0.8rem', fontSize: '0.95rem', fontWeight: 700 }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--maroon-800)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="btn btn-outline"
                  style={{
                    flex: '1 1 200px',
                    padding: '0.95rem 1.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderColor: 'var(--maroon-800)',
                    color: 'var(--maroon-800)',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
                </button>

                {/* Buy Now with PhonePe / COD */}
                <button
                  onClick={handleBuyNow}
                  className="btn btn-primary"
                  style={{
                    flex: '1 1 240px',
                    padding: '0.95rem 1.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(107, 29, 47, 0.3)',
                  }}
                >
                  <Lock size={16} />
                  <span>Instant Checkout (PhonePe / COD)</span>
                </button>
              </div>

              {/* Direct WhatsApp Concierge Button */}
              <button
                onClick={handleWhatsAppEnquiry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.25)',
                  transition: 'all 0.2s',
                }}
              >
                <MessageCircle size={18} />
                <span>Chat with Komal on WhatsApp for Custom Sizing</span>
              </button>

              <button
                onClick={handleShare}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  marginTop: '0.3rem',
                }}
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Link copied to clipboard!' : 'Share this outfit with friends'}</span>
              </button>
            </div>

            {/* Accordion Tabs for Craft, Fit, Shipping */}
            <div style={{ borderTop: '1px solid #e7ded4' }}>
              
              {/* Accordion 1: Details & Craft */}
              <div style={{ borderBottom: '1px solid #e7ded4' }}>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'details' ? '' : 'details')}
                  style={{
                    width: '100%',
                    padding: '1rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--maroon-900)',
                  }}
                >
                  <span>Fabric & Artisanal Needlework</span>
                  <span>{activeAccordion === 'details' ? '−' : '+'}</span>
                </button>

                {activeAccordion === 'details' && (
                  <div style={{ paddingBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: 1.6 }}>
                    <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <li><strong>Fabric:</strong> Pure Chanderi Silk & Handloom Cotton with Butter Crepe Lining.</li>
                      <li><strong>Artisanship:</strong> Hand-guided needlework, delicate gota accents, and tailored finish.</li>
                      <li><strong>Origin:</strong> Designed & crafted at the Sui-Dhaga Atelier Studio, Mumbai.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Delivery & Shipping */}
              <div style={{ borderBottom: '1px solid #e7ded4' }}>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                  style={{
                    width: '100%',
                    padding: '1rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--maroon-900)',
                  }}
                >
                  <span>Delivery, Payment & Returns</span>
                  <span>{activeAccordion === 'shipping' ? '−' : '+'}</span>
                </button>

                {activeAccordion === 'shipping' && (
                  <div style={{ paddingBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: 1.6 }}>
                    <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <li><strong>Payment Modes:</strong> PhonePe UPI QR Code, NetBanking, Cards & Cash on Delivery (COD).</li>
                      <li><strong>Dispatch:</strong> Ready-to-ship outfits dispatch in 24-48 hours via express air courier.</li>
                      <li><strong>Returns / Exchange:</strong> 7-day hassle-free replacement if sizing or fit needs adjustment.</li>
                    </ul>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* You May Also Like Slider / Grid */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '5rem', borderTop: '1px solid rgba(107, 29, 47, 0.12)', paddingTop: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--gold-600)', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}>
                Curated Recommendations
              </div>
              <h2 className="font-display maroon-gradient-text" style={{ fontSize: '2rem', fontWeight: 700 }}>
                Complete The Look in {product.category}
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
              }}
            >
              {relatedProducts.map((rel) => (
                <div key={rel._id} onClick={() => onNavigateProduct(rel._id)} style={{ cursor: 'pointer' }}>
                  <ProductCard product={rel} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Chart Modal */}
      {sizeModalOpen && (
        <div className="modal-backdrop" onClick={() => setSizeModalOpen(false)}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '2rem' }}
          >
            <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Sui-Dhaga Size Guide (Garment Measurements in Inches)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              All outfits include a 2-inch margin inside for easy loosening or tightening.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--ivory-surface)', borderBottom: '2px solid var(--border-gold)' }}>
                  <th style={{ padding: '0.65rem' }}>Size</th>
                  <th style={{ padding: '0.65rem' }}>Bust</th>
                  <th style={{ padding: '0.65rem' }}>Waist</th>
                  <th style={{ padding: '0.65rem' }}>Hip</th>
                  <th style={{ padding: '0.65rem' }}>Length</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'XS', b: '34"', w: '30"', h: '36"', l: '46"' },
                  { s: 'S', b: '36"', w: '32"', h: '38"', l: '46"' },
                  { s: 'M', b: '38"', w: '34"', h: '40"', l: '47"' },
                  { s: 'L', b: '40"', w: '36"', h: '42"', l: '47"' },
                  { s: 'XL', b: '42"', w: '38"', h: '44"', l: '48"' },
                  { s: 'XXL', b: '44"', w: '40"', h: '46"', l: '48"' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #ede4dc', backgroundColor: row.s === selectedSize ? '#faf2f4' : 'transparent' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 800, color: 'var(--maroon-900)' }}>{row.s}</td>
                    <td style={{ padding: '0.65rem' }}>{row.b}</td>
                    <td style={{ padding: '0.65rem' }}>{row.w}</td>
                    <td style={{ padding: '0.65rem' }}>{row.h}</td>
                    <td style={{ padding: '0.65rem' }}>{row.l}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button onClick={() => setSizeModalOpen(false)} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
