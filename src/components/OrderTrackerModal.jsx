import React, { useState } from 'react';
import { X, Search, Package, CheckCircle, Clock, Truck } from 'lucide-react';
import OfficialWhatsAppIcon from './OfficialWhatsAppIcon';
import { useShop } from '../context/ShopContext';

export default function OrderTrackerModal() {
  const { orderTrackerOpen, setOrderTrackerOpen } = useShop();
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!orderTrackerOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setOrders(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success && data.orders?.length > 0) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'No order found with this Order ID or Phone number.');
      }
    } catch (err) {
      setError('Unable to fetch order status. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="modal-backdrop" onClick={() => setOrderTrackerOpen(false)}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #ede4dc', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={24} color="var(--maroon-800)" />
            <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
              Track Your Sui-Dhaga Order
            </h2>
          </div>
          <button
            onClick={() => setOrderTrackerOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: '0.2rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Enter Order ID (e.g. SD-...) or 10-digit Phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input"
            style={{ flexGrow: 1 }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Search size={16} />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </form>

        {error && (
          <div style={{ padding: '0.8rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Results */}
        {orders && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            {orders.map((ord) => {
              const currentStep = getStepIndex(ord.orderStatus);
              const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];

              return (
                <div
                  key={ord._id}
                  style={{
                    backgroundColor: 'var(--ivory-surface)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--maroon-900)' }}>{ord.orderId}</div>
                    </div>
                    <span className="badge-gold">{ord.orderStatus}</span>
                  </div>

                  {/* Progress Timeline */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '1.5rem 0' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '10%',
                        right: '10%',
                        height: '3px',
                        backgroundColor: '#dcd1c6',
                        zIndex: 1,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '10%',
                        width: `${(currentStep / 3) * 80}%`,
                        height: '3px',
                        backgroundColor: 'var(--maroon-800)',
                        zIndex: 2,
                        transition: 'width 0.4s ease',
                      }}
                    />

                    {steps.map((st, i) => {
                      const isDone = i <= currentStep;
                      return (
                        <div key={st} style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              backgroundColor: isDone ? 'var(--maroon-800)' : '#ffffff',
                              border: isDone ? '2px solid var(--gold-500)' : '2px solid #dcd1c6',
                              color: isDone ? '#ffffff' : '#999',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 0.4rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {isDone ? '✓' : i + 1}
                          </div>
                          <div style={{ fontSize: '0.72rem', fontWeight: isDone ? 700 : 500, color: isDone ? 'var(--maroon-900)' : '#888' }}>
                            {st}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Details */}
                  <div style={{ fontSize: '0.82rem', borderTop: '1px solid #e2d7cc', paddingTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div>
                      <strong>Customer:</strong> {ord.customer.name} ({ord.customer.phone})
                    </div>
                    <div>
                      <strong>Courier Tracking No:</strong> {ord.trackingNumber || 'Assigned upon dispatch'}
                    </div>
                    <div>
                      <strong>Items ({ord.items.length}):</strong>{' '}
                      {ord.items.map((it) => `${it.title} (${it.size}) × ${it.quantity}`).join(', ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
                      <span>Total: ₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                      <span>Payment: {ord.paymentMethod}</span>
                    </div>
                  </div>

                  {/* WhatsApp Support button for this order */}
                  <a
                    href={`https://wa.me/918767547514?text=${encodeURIComponent(
                      `Hi SuiDhaga / Komal! I am inquiring about my Sui-Dhaga order #${ord.orderId}. Could you please share an update?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-gold btn-sm"
                    style={{ width: '100%', marginTop: '1rem', color: 'var(--maroon-800)', borderColor: 'var(--border-gold)' }}
                  >
                    <OfficialWhatsAppIcon size={15} color="#25D366" />
                    <span>Inquire on WhatsApp about Order #{ord.orderId}</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
