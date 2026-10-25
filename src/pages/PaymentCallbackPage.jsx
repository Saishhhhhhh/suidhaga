import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, ShieldCheck, ArrowRight, Printer, ShoppingBag, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';

export default function PaymentCallbackPage({ onNavigateHome, onOpenTracker }) {
  const { clearCart } = useShop();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('CHECKING'); // 'COMPLETED' | 'PENDING' | 'FAILED' | 'CHECKING'
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract orderId from query string
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId') || urlParams.get('merchantOrderId') || '';

  useEffect(() => {
    let isMounted = true;

    const verifyPayment = async () => {
      if (!orderId) {
        setStatus('FAILED');
        setErrorMessage('No Order ID provided in payment callback.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/payment/phonepe/status/${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (isMounted) {
          if (data.success && data.order) {
            setOrder(data.order);
            setStatus(data.state || (data.order.paymentStatus === 'Paid' ? 'COMPLETED' : 'PENDING'));

            if (data.state === 'COMPLETED' || data.order.paymentStatus === 'Paid') {
              // Clear cart on successful purchase
              clearCart();
              // Fire celebratory confetti
              confetti({
                particleCount: 120,
                spread: 75,
                origin: { y: 0.6 },
                colors: ['#6b1d2f', '#d4af37', '#25D366', '#5f259f'],
              });
            }
          } else {
            setStatus('FAILED');
            setErrorMessage(data.message || 'Could not verify transaction with PhonePe.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error verifying payment callback:', err);
          setStatus('FAILED');
          setErrorMessage('Network error while verifying payment status.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: 'var(--cream-bg)', minHeight: '80vh', padding: '3.5rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        
        {loading ? (
          <div
            className="card-luxury animate-fade-in"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                border: '4px solid var(--border-gold)',
                borderTopColor: '#5f259f',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'spin 1s linear infinite',
              }}
            />
            <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>
              Verifying PhonePe Payment...
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Communicating securely with PhonePe Payment Gateway. Please do not close or refresh this tab.
            </p>
          </div>
        ) : status === 'COMPLETED' ? (
          <div
            className="card-luxury animate-fade-in"
            style={{
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1.5px solid var(--border-gold)',
            }}
          >
            {/* Top PhonePe Verified Ribbon */}
            <div
              style={{
                backgroundColor: '#5f259f',
                color: '#fff',
                padding: '0.85rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#22c55e" />
                <span>PhonePe PG Verified Payment</span>
              </div>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                LIVE TRANSACTION
              </span>
            </div>

            <div style={{ padding: '2.5rem 2rem' }}>
              {/* Success Icon */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <CheckCircle size={44} color="#16a34a" />
                </div>
                <h1 className="font-display maroon-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Payment Successful!
                </h1>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem' }}>
                  Thank you for shopping with Sui-Dhaga by Komal. Your handcrafted order has been confirmed.
                </p>
              </div>

              {/* Order Info Box */}
              <div
                style={{
                  backgroundColor: 'var(--ivory-surface)',
                  border: '1px solid var(--border-delicate)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.86rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Order Number</span>
                    <strong style={{ color: 'var(--maroon-900)', fontSize: '0.95rem' }}>{order?.orderId}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Amount Paid</span>
                    <strong style={{ color: '#16a34a', fontSize: '1.1rem' }}>₹{order?.totalAmount?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Payment Mode</span>
                    <strong>PhonePe PG (UPI / Cards / NetBanking)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>PhonePe Ref ID</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#5f259f', fontWeight: 700 }}>
                      {order?.phonePeTransactionId || 'TXN-CONFIRMED'}
                    </span>
                  </div>
                </div>

                {order?.customer && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #ded4cc', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Delivery Address</span>
                    <strong>{order.customer.name}</strong> • {order.customer.phone}
                    <div style={{ color: 'var(--text-medium)' }}>
                      {order.customer.address?.street}, {order.customer.address?.city}, {order.customer.address?.state} - {order.customer.address?.pincode}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Promise */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  backgroundColor: '#f6fdf7',
                  border: '1px solid #bbf7d0',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '2rem',
                }}
              >
                <Truck size={22} color="#16a34a" />
                <div style={{ fontSize: '0.84rem', color: '#166534' }}>
                  <strong>Dispatch within 24-48 Hours:</strong> You will receive SMS & WhatsApp tracking updates when your bespoke parcel ships.
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={onNavigateHome}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem 1.25rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>Continue Shopping</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="btn btn-outline"
                  style={{ padding: '0.85rem 1.25rem' }}
                  title="Print Payment Receipt"
                >
                  <Printer size={18} />
                  <span>Print Receipt</span>
                </button>
              </div>

            </div>
          </div>
        ) : status === 'PENDING' ? (
          <div
            className="card-luxury animate-fade-in"
            style={{
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Clock size={36} color="#d97706" />
            </div>
            <h2 className="font-display" style={{ fontSize: '1.6rem', color: '#b45309', marginBottom: '0.5rem' }}>
              Payment is Processing
            </h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              PhonePe is waiting for confirmation from your bank or UPI application. Order #{orderId} is registered.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              Re-Check Status
            </button>
          </div>
        ) : (
          <div
            className="card-luxury animate-fade-in"
            style={{
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <AlertCircle size={36} color="#dc2626" />
            </div>
            <h2 className="font-display" style={{ fontSize: '1.6rem', color: '#991b1b', marginBottom: '0.5rem' }}>
              Payment Incomplete or Cancelled
            </h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {errorMessage || 'The payment transaction could not be completed via PhonePe.'}
            </p>
            <button
              onClick={onNavigateHome}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              Return to Store
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
