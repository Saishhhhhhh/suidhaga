import React, { useState, useEffect } from 'react';
import { Search, Eye, Truck, CheckCircle, Clock, Trash2, X, MessageCircle, FileText } from 'lucide-react';

export default function AdminOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/orders?limit=50';
      if (statusFilter !== 'All') url += `&status=${statusFilter}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!trackingModalOrder || !newTrackingNumber.trim()) return;

    try {
      const res = await fetch(`/api/orders/${trackingModalOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackingNumber: newTrackingNumber.trim(),
          orderStatus: 'Shipped',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTrackingModalOrder(null);
        setNewTrackingNumber('');
        fetchOrders();
      }
    } catch (err) {
      alert('Failed to update tracking');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const statuses = ['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Customer Orders Management ({orders.length})
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
            Process incoming orders, assign dispatch tracking numbers, and manage fulfillment.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="card-luxury"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexGrow: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--maroon-700)" />
          <input
            type="text"
            placeholder="Search by Order ID, Phone, Customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
          >
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-luxury" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--ivory-surface)', borderBottom: '1px solid #dcd1c6', color: 'var(--maroon-900)' }}>
              <th style={{ padding: '1rem' }}>Order ID & Date</th>
              <th style={{ padding: '1rem' }}>Customer Details</th>
              <th style={{ padding: '1rem' }}>Items Summary</th>
              <th style={{ padding: '1rem' }}>Total & Payment</th>
              <th style={{ padding: '1rem' }}>Fulfillment Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No orders found. Customer orders placed on the frontend will appear here instantly!
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr
                  key={ord._id}
                  style={{ borderBottom: '1px solid rgba(107, 29, 47, 0.08)' }}
                  className="table-row-hover"
                >
                  {/* Order ID & Date */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--maroon-900)' }}>{ord.orderId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>

                  {/* Customer */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>{ord.customer?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--maroon-800)' }}>
                      <a
                        href={`https://wa.me/${ord.customer?.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#16a34a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <MessageCircle size={13} /> {ord.customer?.phone}
                      </a>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ord.customer?.address?.city}, {ord.customer?.address?.pincode}
                    </div>
                  </td>

                  {/* Items */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      {ord.items?.length} Item{ord.items?.length > 1 ? 's' : ''}:
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', maxWidth: '220px' }}>
                      {ord.items?.map((it) => `${it.title.slice(0, 20)}.. (${it.size}) × ${it.quantity}`).join(', ')}
                    </div>
                  </td>

                  {/* Amount & Mode */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--maroon-900)', fontSize: '0.95rem' }}>
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ord.paymentMethod} • <span style={{ color: ord.paymentStatus === 'Paid' ? '#16a34a' : '#d97706', fontWeight: 600 }}>{ord.paymentStatus}</span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="form-select"
                      style={{
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor:
                          ord.orderStatus === 'Delivered'
                            ? '#dcfce7'
                            : ord.orderStatus === 'Shipped'
                            ? '#e0e7ff'
                            : ord.orderStatus === 'Cancelled'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          ord.orderStatus === 'Delivered'
                            ? '#166534'
                            : ord.orderStatus === 'Shipped'
                            ? '#3730a3'
                            : ord.orderStatus === 'Cancelled'
                            ? '#991b1b'
                            : '#92400e',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {ord.trackingNumber && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Trk: {ord.trackingNumber}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      {/* View Invoice */}
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        style={{ backgroundColor: '#fff', border: '1px solid #d4c8c0', borderRadius: '4px', padding: '0.35rem 0.55rem', cursor: 'pointer', color: 'var(--maroon-800)' }}
                        title="View Full Invoice"
                      >
                        <FileText size={15} />
                      </button>

                      {/* Add Tracking */}
                      <button
                        onClick={() => {
                          setTrackingModalOrder(ord);
                          setNewTrackingNumber(ord.trackingNumber || '');
                        }}
                        style={{ backgroundColor: '#fff', border: '1px solid var(--border-gold)', borderRadius: '4px', padding: '0.35rem 0.55rem', cursor: 'pointer', color: '#8c6913' }}
                        title="Assign Tracking Courier"
                      >
                        <Truck size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(ord._id)}
                        style={{ backgroundColor: '#fff', border: '1px solid #fecaca', borderRadius: '4px', padding: '0.35rem 0.55rem', cursor: 'pointer', color: '#dc2626' }}
                        title="Delete order"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--maroon-800)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <img src="/assets/logo.webp" alt="Sui Dhaga" style={{ height: '42px', marginBottom: '0.3rem' }} />
                <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  Order Invoice: {selectedOrder.orderId}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: 'var(--maroon-800)' }}>Customer:</strong>
                <div>{selectedOrder.customer.name}</div>
                <div>{selectedOrder.customer.email}</div>
                <div>{selectedOrder.customer.phone}</div>
              </div>

              <div>
                <strong style={{ color: 'var(--maroon-800)' }}>Delivery Address:</strong>
                <div>{selectedOrder.customer.address.street}</div>
                <div>{selectedOrder.customer.address.city}, {selectedOrder.customer.address.state} - {selectedOrder.customer.address.pincode}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #ede4dc', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.8rem' }}>Ordered Items:</div>
              {selectedOrder.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span>{it.title} (Size: {it.size}) × {it.quantity}</span>
                  <strong>₹{(it.price * it.quantity).toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #ede4dc', paddingTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>Discount:</span>
                  <span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping:</span>
                <span>{selectedOrder.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.shippingFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--maroon-900)', borderTop: '1px solid #dcd1c6', paddingTop: '0.4rem' }}>
                <span>Total Amount:</span>
                <span>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Tracking Modal */}
      {trackingModalOrder && (
        <div className="modal-backdrop" onClick={() => setTrackingModalOrder(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
            <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Assign Dispatch Tracking No.
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: '1.2rem' }}>
              Order: <strong>{trackingModalOrder.orderId}</strong> for {trackingModalOrder.customer.name}
            </p>

            <form onSubmit={handleSaveTracking}>
              <div className="form-group">
                <label className="form-label">Tracking Number / AWB Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BLUEDART-984210 or DELHIVERY-43110"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" onClick={() => setTrackingModalOrder(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save & Mark as Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
