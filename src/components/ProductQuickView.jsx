import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, Star, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductQuickView({ onOpenProduct }) {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct._id);
  const images = quickViewProduct.images && quickViewProduct.images.length > 0
    ? quickViewProduct.images
    : ['/assets/maroon_anarkali.jpg'];

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({ valid: true, msg: 'Express Delivery available in 3-4 days!' });
    } else {
      setPincodeStatus({ valid: false, msg: 'Please enter a valid 6-digit Indian PIN code.' });
    }
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hello Komal! I'm looking at "${quickViewProduct.title}" (₹${quickViewProduct.price}) on Sui-Dhaga. Can you help me with customization and order?`
    );
    window.open(`https://wa.me/919773001771?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem', maxWidth: '960px' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-dark)',
            padding: '0.4rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={24} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Left: Images */}
          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#f3ece7',
                marginBottom: '1rem',
                paddingTop: '125%',
              }}
            >
              <img
                src={images[activeImageIdx]}
                alt={quickViewProduct.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {quickViewProduct.discount > 0 && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span className="badge-sale">{quickViewProduct.discount}% OFF</span>
                </div>
              )}
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      border: activeImageIdx === idx ? '2px solid var(--maroon-800)' : '1px solid #ddd',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      width: '64px',
                      height: '64px',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge-gold">{quickViewProduct.category}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Fabric: <strong>{quickViewProduct.fabric}</strong>
              </span>
            </div>

            <h2 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {quickViewProduct.title}
            </h2>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#d4af37" color="#d4af37" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>4.9 • 42 Handcrafted Reviews</span>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--maroon-800)' }}>
                ₹{quickViewProduct.price.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {quickViewProduct.description || quickViewProduct.shortDescription}
            </p>

            {/* Size Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Select Size:</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--maroon-700)', textDecoration: 'underline', cursor: 'pointer' }}>
                  Standard Indian Size Chart
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(quickViewProduct.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      border: selectedSize === sz ? '2px solid var(--maroon-800)' : '1px solid #d4c8c0',
                      backgroundColor: selectedSize === sz ? 'var(--maroon-800)' : '#ffffff',
                      color: selectedSize === sz ? '#ffffff' : 'var(--text-dark)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.9rem',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d4c8c0', borderRadius: 'var(--radius-sm)' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ border: 'none', background: 'none', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ padding: '0.4rem 0.8rem', fontWeight: 700, minWidth: '35px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ border: 'none', background: 'none', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  addToCart(quickViewProduct, selectedSize, quantity);
                  setQuickViewProduct(null);
                }}
                className="btn btn-primary btn-lg"
                style={{ flexGrow: 1 }}
              >
                <ShoppingBag size={18} />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleWhatsAppChat}
                className="btn btn-gold btn-lg"
                style={{ flexGrow: 1 }}
              >
                <MessageCircle size={18} color="#25D366" />
                <span>Order via WhatsApp</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct._id)}
                style={{
                  background: isWishlisted ? 'var(--maroon-50)' : '#ffffff',
                  border: '1.5px solid var(--border-delicate)',
                  borderRadius: 'var(--radius-full)',
                  width: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Wishlist"
              >
                <Heart size={20} color={isWishlisted ? '#c23b4b' : '#6b1d2f'} fill={isWishlisted ? '#c23b4b' : 'none'} />
              </button>
            </div>

            {onOpenProduct && (
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    onOpenProduct(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--maroon-800)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  View Full Product Details & Craftsmanship Guide →
                </button>
              </div>
            )}

            {/* Pincode Check */}
            <div style={{ backgroundColor: '#faf6f0', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <Truck size={15} color="var(--maroon-800)" />
                <span>Check Delivery & Cash on Delivery (COD) Availability</span>
              </div>
              <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="form-input"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-outline btn-sm">
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <div style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: pincodeStatus.valid ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {pincodeStatus.msg}
                </div>
              )}
            </div>

            {/* Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', borderTop: '1px solid #ede4dc', paddingTop: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={20} color="var(--maroon-800)" style={{ margin: '0 auto 0.2rem' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>100% Authentic</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <RotateCcw size={20} color="var(--maroon-800)" style={{ margin: '0 auto 0.2rem' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Easy 7-Day Exchange</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Truck size={20} color="var(--maroon-800)" style={{ margin: '0 auto 0.2rem' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Pan-India Shipping</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
