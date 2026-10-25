import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, ShoppingBag, ArrowRight, MessageCircle, QrCode, Smartphone, CreditCard, Lock, Copy, Check, ExternalLink } from 'lucide-react';
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
    paymentMethod: 'PHONEPE', // Default to PhonePe
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // PhonePe Gateway State
  const [phonePeModalOpen, setPhonePeModalOpen] = useState(false);
  const [phonePeTimer, setPhonePeTimer] = useState(600); // 10 minutes in seconds
  const [phonePeUtr, setPhonePeUtr] = useState('');
  const [vpaInput, setVpaInput] = useState('');
  const [vpaRequested, setVpaRequested] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Timer countdown for PhonePe payment session
  useEffect(() => {
    let interval = null;
    if (phonePeModalOpen && phonePeTimer > 0) {
      interval = setInterval(() => {
        setPhonePeTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phonePeModalOpen, phonePeTimer]);

  if (!checkoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText('9773001771@ybl');
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2500);
  };

  const executeOrderPlacement = async (paymentMethod, phonePeTxn = '') => {
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
        paymentMethod: paymentMethod,
        phonePeTransactionId: phonePeTxn,
        paymentStatus: phonePeTxn ? 'Paid' : 'Pending',
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
        setPhonePeModalOpen(false);
        clearCart();

        // Celebratory Confetti!
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#5f259f', '#6B1D2F', '#D4AF37', '#ffffff'],
          });
        } catch {}

        showNotification(
          paymentMethod === 'PHONEPE'
            ? '🎉 PhonePe Payment Verified & Order Confirmed!'
            : 'Order placed successfully! We will contact you.'
        );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      alert('Please fill in all shipping details.');
      return;
    }

    if (formData.paymentMethod === 'PHONEPE') {
      // Open PhonePe Payment Gateway Modal
      setPhonePeTimer(600);
      setPhonePeUtr(`PP${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`);
      setPhonePeModalOpen(true);
    } else {
      await executeOrderPlacement(formData.paymentMethod);
    }
  };

  const handleVerifyPhonePePayment = () => {
    const txnId = phonePeUtr || `PP${Date.now().toString().slice(-6)}`;
    executeOrderPlacement('PHONEPE', txnId);
  };

  const indianStates = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu',
    'Uttar Pradesh', 'Rajasthan', 'Telangana', 'West Bengal', 'Punjab',
    'Haryana', 'Madhya Pradesh', 'Kerala', 'Goa', 'Other'
  ];

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const upiDeepLink = `upi://pay?pa=9773001771@ybl&pn=SuiDhagaByKomal&am=${cartTotal}&cu=INR&tn=SuiDhagaOrder`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiDeepLink)}`;

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
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
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#eef8ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
              }}
            >
              <CheckCircle size={46} color="#16a34a" />
            </div>

            <h3 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--maroon-900)', marginBottom: '0.4rem' }}>
              Dhanyawaad, {orderSuccess.customer.name}!
            </h3>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your order has been crafted with love and registered in our atelier.
            </p>

            {/* Order Details Card */}
            <div
              style={{
                backgroundColor: 'var(--ivory-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                maxWidth: '540px',
                margin: '0 auto 2rem',
                textAlign: 'left',
                border: '1px solid var(--border-gold)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID:</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--maroon-800)' }}>{orderSuccess.orderId}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment Mode:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {orderSuccess.paymentMethod === 'PHONEPE' ? (
                    <span style={{ backgroundColor: '#5f259f', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                      PhonePe UPI (Verified)
                    </span>
                  ) : (
                    <strong>{orderSuccess.paymentMethod}</strong>
                  )}
                </div>
              </div>

              {orderSuccess.phonePeTransactionId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PhonePe Txn ID:</span>
                  <code style={{ fontSize: '0.85rem', color: '#5f259f', fontWeight: 700 }}>{orderSuccess.phonePeTransactionId}</code>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount:</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--maroon-900)' }}>₹{orderSuccess.totalAmount.toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0d5cb', paddingTop: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Deliver To:</span>
                <span style={{ fontSize: '0.85rem', textAlign: 'right', maxWidth: '280px' }}>
                  {orderSuccess.customer.address.street}, {orderSuccess.customer.address.city}, {orderSuccess.customer.address.pincode}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/919773001771?text=${encodeURIComponent(
                  `Hi Komal! I just placed order ${orderSuccess.orderId} via ${orderSuccess.paymentMethod} on Sui-Dhaga for ₹${orderSuccess.totalAmount}. Please confirm!`
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
              {/* Shipping Address Column */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--maroon-800)' }}>
                  1. Shipping & Contact Details
                </h3>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Priya Sharma"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="priya@example.com"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp Mobile *</label>
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

              {/* Order Summary & Payment Mode Column */}
              <div style={{ backgroundColor: 'var(--ivory-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--maroon-800)' }}>
                  2. Order Summary & Payment
                </h3>

                {/* Items preview */}
                <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    
                    {/* PhonePe Option (Highlighted) */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.9rem',
                        backgroundColor: formData.paymentMethod === 'PHONEPE' ? '#fbf8ff' : '#ffffff',
                        border: formData.paymentMethod === 'PHONEPE' ? '2px solid #5f259f' : '1px solid #dcd1c6',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                        boxShadow: formData.paymentMethod === 'PHONEPE' ? '0 3px 12px rgba(95, 37, 159, 0.12)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="PHONEPE"
                          checked={formData.paymentMethod === 'PHONEPE'}
                          onChange={handleChange}
                          style={{ accentColor: '#5f259f' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontWeight: 800, color: '#5f259f', fontSize: '0.92rem' }}>PhonePe</span>
                            <span style={{ backgroundColor: '#5f259f', color: '#ffffff', fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                              RECOMMENDED
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#666' }}>UPI QR Code, PhonePe App, NetBanking & Cards</div>
                        </div>
                      </div>
                      <div style={{ width: '28px', height: '28px', backgroundColor: '#5f259f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '0.9rem' }}>
                        पे
                      </div>
                    </label>

                    {/* Cash on Delivery (COD) */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.9rem',
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
                      <div>
                        <strong>Cash on Delivery (COD)</strong>
                        <div style={{ fontSize: '0.74rem', color: '#666' }}>Pay in cash or UPI when package is delivered</div>
                      </div>
                    </label>

                    {/* General UPI */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.9rem',
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
                      <div>
                        <strong>Google Pay / Other UPI</strong>
                        <div style={{ fontSize: '0.74rem', color: '#666' }}>Pay via any alternative UPI handle</div>
                      </div>
                    </label>

                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    fontSize: '1rem',
                    backgroundColor: formData.paymentMethod === 'PHONEPE' ? '#5f259f' : 'var(--maroon-800)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    boxShadow: formData.paymentMethod === 'PHONEPE' ? '0 4px 15px rgba(95, 37, 159, 0.3)' : '0 4px 15px rgba(107, 29, 47, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Lock size={16} />
                  <span>
                    {loading
                      ? 'Processing...'
                      : formData.paymentMethod === 'PHONEPE'
                      ? `Pay ₹${cartTotal.toLocaleString('en-IN')} with PhonePe`
                      : `Confirm & Place Order (₹${cartTotal.toLocaleString('en-IN')})`}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* PhonePe Payment Gateway Modal */}
        {phonePeModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '460px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              {/* PhonePe Purple Header */}
              <div
                style={{
                  backgroundColor: '#5f259f',
                  color: '#ffffff',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      color: '#5f259f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                    }}
                  >
                    पे
                  </div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.04em' }}>PhonePe Payment</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Official Sui Dhaga Secure Gateway</div>
                  </div>
                </div>
                <button
                  onClick={() => setPhonePeModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Amount & Timer Bar */}
              <div
                style={{
                  backgroundColor: '#f3e8ff',
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e9d5ff',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#6b21a8' }}>Amount to Pay: </span>
                  <strong style={{ fontSize: '1.15rem', color: '#5f259f' }}>₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#7e22ce', fontWeight: 700 }}>
                  <span>Expires in:</span>
                  <span style={{ backgroundColor: '#ffffff', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #d8b4fe' }}>
                    {formatTimer(phonePeTimer)}
                  </span>
                </div>
              </div>

              {/* PhonePe Gateway Body */}
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                
                {/* QR Code Card */}
                <div
                  style={{
                    border: '1.5px dashed #5f259f',
                    borderRadius: '12px',
                    padding: '1.25rem 1rem',
                    backgroundColor: '#faf5ff',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4c1d95', marginBottom: '0.75rem' }}>
                    Scan with PhonePe or Any UPI App
                  </div>

                  <div style={{ width: '180px', height: '180px', margin: '0 auto 0.75rem', backgroundColor: '#fff', padding: '6px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <img
                      src={qrCodeUrl}
                      alt="PhonePe UPI QR Code"
                      style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                  </div>

                  {/* VPA Pill */}
                  <div
                    onClick={handleCopyVpa}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d8b4fe',
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      color: '#5f259f',
                      fontWeight: 600,
                    }}
                    title="Click to copy UPI ID"
                  >
                    <span>UPI ID: <strong>9773001771@ybl</strong></span>
                    {copiedVpa ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  </div>
                </div>

                {/* Mobile Intent Direct Trigger */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <a
                    href={upiDeepLink}
                    className="btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#5f259f',
                      color: '#ffffff',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    <Smartphone size={16} />
                    <span>Open PhonePe App Directly</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Verification Action */}
                <div style={{ borderTop: '1px solid #f0e7f7', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: '0.75rem' }}>
                    Once payment is completed in PhonePe, click below to confirm:
                  </div>

                  <button
                    onClick={handleVerifyPhonePePayment}
                    disabled={loading}
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    <CheckCircle size={18} />
                    <span>{loading ? 'Verifying PhonePe Payment...' : 'I Have Paid via PhonePe (Confirm Order)'}</span>
                  </button>
                </div>

              </div>

              {/* Security Footer */}
              <div
                style={{
                  backgroundColor: '#f9f5fd',
                  padding: '0.65rem',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  color: '#6b21a8',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <Lock size={12} />
                <span>100% Encrypted & NPCI Verified Payment</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
