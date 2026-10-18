import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCheckoutOpen,
  } = useShop();

  if (!cartOpen) return null;

  const freeShippingThreshold = 1999;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
    }
  };

  const handleProceedCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(31, 20, 22, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 35px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(107, 29, 47, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--ivory-base)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="var(--maroon-800)" />
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
              Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dark)',
              padding: '0.3rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '0.8rem 1.5rem', backgroundColor: '#faf4eb', borderBottom: '1px solid #eddcc9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>
              {freeShippingLeft === 0 ? (
                <strong style={{ color: '#16a34a' }}>🎉 You unlocked FREE Shipping across India!</strong>
              ) : (
                <span>
                  Add <strong style={{ color: 'var(--maroon-800)' }}>₹{freeShippingLeft}</strong> more for <strong>FREE Shipping</strong>
                </span>
              )}
            </span>
            <span style={{ color: '#8c6913' }}>{freeShippingProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2d5c3', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: 'var(--gold-500)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--maroon-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                }}
              >
                <ShoppingBag size={34} color="var(--maroon-700)" />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                Your bag is empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Discover Komal’s handcrafted festive collections and find your perfect outfit.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="btn btn-primary btn-sm"
              >
                <span>Explore Ethnic Wear</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid rgba(107, 29, 47, 0.08)',
                  }}
                >
                  {/* Item Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '76px',
                      height: '98px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#f3ece7',
                    }}
                  />

                  {/* Item Details */}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: 'var(--text-dark)',
                          lineHeight: 1.3,
                          maxWidth: '220px',
                        }}
                      >
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#a89895',
                          padding: '0.2rem',
                        }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                      <span>Size: <strong>{item.size}</strong></span>
                      {item.fabric && <span>• {item.fabric}</span>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #d4c8c0',
                          borderRadius: '4px',
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(item.cartId, -1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '0.2rem 0.5rem',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartId, 1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '0.2rem 0.5rem',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--maroon-800)' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid rgba(107, 29, 47, 0.12)',
              backgroundColor: 'var(--ivory-base)',
            }}
          >
            {/* Coupon Code Section */}
            <div style={{ marginBottom: '1rem' }}>
              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#eef8ef',
                    border: '1px dashed #22c55e',
                    padding: '0.45rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 700 }}>
                    <Tag size={14} />
                    <span>Coupon {appliedCoupon.code} applied (-{appliedCoupon.percent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (Try SUIDHAGA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem', textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-medium)' }}>
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                  <span>Festive Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-medium)' }}>
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingFee}`}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(107, 29, 47, 0.12)',
                  paddingTop: '0.6rem',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--maroon-900)',
                }}
              >
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
