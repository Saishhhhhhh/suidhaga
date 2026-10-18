import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';

export default function CheckoutModal() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    clearCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    showNotification,
  } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    paymentMethod: 'COD',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!checkoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      alert('Please fill in all shipping details.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        },
        items: cart.map((item) => ({
          product: item.productId,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
        subtotal: cartSubtotal,
        discount: discountAmount,
        shippingFee,
        totalAmount: cartTotal,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success) {
        setOrderSuccess(data.order);
        clearCart();

        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6B1D2F', '#D4AF37', '#FAF7F2'],
          });
        } catch {}

        showNotification('Order placed successfully! We will contact you.');
      } else {
        alert(data.message || 'Error processing order');
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to connect to order server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu',
    'Uttar Pradesh', 'Rajasthan', 'Telangana', 'West Bengal', 'Punjab',
    'Haryana', 'Madhya Pradesh', 'Kerala', 'Goa', 'Other'
  ];

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(107, 29, 47, 0.1)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} color="var(--maroon-800)" />
            <h2 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
              {orderSuccess ? 'Order Confirmed!' : 'Secure Express Checkout'}
            </h2>
          </div>
          <button
            onClick={() => setCheckoutOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: '0.3rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Success View */
          <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#eef8ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
              }}
            >
              <CheckCircle size={44} color="#16a34a" />
            </div>

            <h3 className="font-display" style={{ fontSize: '1.7rem', color: 'var(--maroon-900)', marginBottom: '0.4rem' }}>
              Dhanyawaad, {orderSuccess.customer.name}!
            </h3>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your order has been crafted with love and registered in our system.
            </p>

            {/* Order Details Card */}
            <div
              style={{
                backgroundColor: 'var(--ivory-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                maxWidth: '520px',
                margin: '0 auto 2rem',
                textAlign: 'left',
                border: '1px solid var(--border-gold)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID:</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--maroon-800)' }}>{orderSuccess.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment Mode:</span>
                <strong>{orderSuccess.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount:</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--maroon-900)' }}>₹{orderSuccess.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0d5cb', paddingTop: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Deliver To:</span>
                <span style={{ fontSize: '0.85rem', textAlign: 'right', maxWidth: '260px' }}>
                  {orderSuccess.customer.address.street}, {orderSuccess.customer.address.city}, {orderSuccess.customer.address.pincode}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/919773001771?text=${encodeURIComponent(
                  `Hi Komal! I just placed order ${orderSuccess.orderId} on Sui-Dhaga for ₹${orderSuccess.totalAmount}. Please confirm!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ padding: '0.75rem 1.6rem' }}
              >
                <MessageCircle size={18} color="#25D366" />
                <span>Get Order Updates on WhatsApp</span>
              </a>

              <button
                onClick={() => setCheckoutOpen(false)}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.6rem' }}
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Shipping Form Fields */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--maroon-800)' }}>
                  1. Shipping Information
                </h3>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone (+91) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Address (House No, Building, Street) *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Flat 402, Lotus Residency, MG Road"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Order Notes / Customization Request (Optional)</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Please customize length to 42 inches or deliver before Saturday"
                    className="form-textarea"
                  />
                </div>
              </div>

              {/* Order Summary & Payment Mode */}
              <div style={{ backgroundColor: 'var(--ivory-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--maroon-800)' }}>
                  2. Order Summary & Payment
                </h3>

                {/* Items preview */}
                <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {cart.map((item) => (
                    <div key={item.cartId} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <img src={item.image} alt={item.title} style={{ width: '42px', height: '52px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flexGrow: 1, fontSize: '0.82rem' }}>
                        <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{item.title}</div>
                        <div style={{ color: 'var(--text-muted)' }}>Size: {item.size} × {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ borderTop: '1px solid #dcd1c6', paddingTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--maroon-900)', borderTop: '1px solid #dcd1c6', paddingTop: '0.5rem' }}>
                    <span>Total Payable</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Payment Selection */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem' }}>Select Payment Method:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.8rem',
                        backgroundColor: '#ffffff',
                        border: formData.paymentMethod === 'COD' ? '2px solid var(--maroon-800)' : '1px solid #dcd1c6',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleChange}
                      />
                      <span><strong>Cash on Delivery (COD)</strong> - Pay when package arrives</span>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.8rem',
                        backgroundColor: '#ffffff',
                        border: formData.paymentMethod === 'UPI' ? '2px solid var(--maroon-800)' : '1px solid #dcd1c6',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={formData.paymentMethod === 'UPI'}
                        onChange={handleChange}
                      />
                      <span><strong>UPI / QR / Online Simulation</strong> (Google Pay, PhonePe, Cards)</span>
                    </label>
                  </div>
                </div>

                {/* Submit Order */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
                >
                  {loading ? 'Processing Order...' : `Confirm & Place Order (₹${cartTotal.toLocaleString('en-IN')})`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
