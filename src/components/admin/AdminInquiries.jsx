import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, CheckCircle2, Trash2, Search, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';
import OfficialWhatsAppIcon from '../OfficialWhatsAppIcon';

export default function AdminInquiries({ token }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [token]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        setActionNotice(`Inquiry marked as ${newStatus}`);
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        setActionNotice('Inquiry removed');
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = filterStatus === 'All' || inq.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.phone?.includes(q) ||
      inq.message?.toLowerCase().includes(q) ||
      inq.subject?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const countNew = inquiries.filter((i) => i.status === 'New').length;
  const countReplied = inquiries.filter((i) => i.status === 'Replied').length;

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--maroon-900)', margin: 0 }}>
              Customer Messages & Inquiries
            </h2>
            {countNew > 0 && (
              <span
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {countNew} New
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Direct messages submitted by visitors on the Contact Us page of connectsuidhaga.com
          </p>
        </div>

        <button onClick={fetchInquiries} className="btn btn-outline btn-sm" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {actionNotice && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card-luxury" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Inquiries
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--maroon-900)', marginTop: '0.3rem' }}>
            {inquiries.length}
          </div>
        </div>

        <div className="card-luxury" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600, textTransform: 'uppercase' }}>
            Awaiting Reply
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', marginTop: '0.3rem' }}>
            {countNew}
          </div>
        </div>

        <div className="card-luxury" style={{ padding: '1.25rem', borderLeft: '4px solid #16a34a' }}>
          <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600, textTransform: 'uppercase' }}>
            Replied / Resolved
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803d', marginTop: '0.3rem' }}>
            {countReplied}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'New', 'Replied'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: filterStatus === st ? '1.5px solid var(--maroon-800)' : '1px solid #dcd4ce',
                backgroundColor: filterStatus === st ? 'var(--maroon-800)' : '#ffffff',
                color: filterStatus === st ? '#ffffff' : 'var(--text-dark)',
                fontSize: '0.84rem',
                fontWeight: filterStatus === st ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {st} {st === 'New' && countNew > 0 ? `(${countNew})` : ''}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by name, phone, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.85rem 0.45rem 2.4rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #dcd4ce',
              fontSize: '0.84rem',
              outline: 'none',
              backgroundColor: '#ffffff',
            }}
          />
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.8rem' }} />
          <div>Loading customer inquiries...</div>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div
          className="card-luxury"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            color: 'var(--text-muted)',
          }}
        >
          <MessageSquare size={36} color="#d4af37" style={{ margin: '0 auto 1rem' }} />
          <h3 className="font-display" style={{ color: 'var(--maroon-900)', marginBottom: '0.5rem' }}>
            No Messages Found
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            {searchQuery
              ? `No messages matched "${searchQuery}".`
              : 'Messages submitted by customers via the Contact Us form will appear here with instant WhatsApp and email reply shortcuts.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredInquiries.map((inq) => {
            const cleanPhone = (inq.phone || '').replace(/\D/g, '');
            const waUrl = `https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(
              inq.name
            )}!%20Thank%20you%20for%20contacting%20Sui-Dhaga%20by%20Komal.%20In%20regards%20to%20your%20inquiry%20("${encodeURIComponent(
              inq.subject
            )}")...`;

            return (
              <div
                key={inq._id}
                className="card-luxury"
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  borderLeft: inq.status === 'New' ? '4px solid #f59e0b' : '4px solid #16a34a',
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.8rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--maroon-900)', fontWeight: 700 }}>
                        {inq.name}
                      </h4>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: inq.status === 'New' ? '#fef3c7' : '#dcfce7',
                          color: inq.status === 'New' ? '#b45309' : '#15803d',
                        }}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        marginTop: '0.35rem',
                        fontSize: '0.84rem',
                        color: 'var(--text-medium)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={13} color="var(--maroon-800)" />
                        <strong>{inq.phone}</strong>
                      </span>
                      {inq.email && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={13} color="var(--maroon-800)" />
                          <a href={`mailto:${inq.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {inq.email}
                          </a>
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <Clock size={13} />
                        {new Date(inq.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {cleanPhone && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{
                          backgroundColor: '#f0fdf4',
                          borderColor: '#86efac',
                          color: '#16a34a',
                          fontWeight: 700,
                        }}
                        title="Reply on WhatsApp"
                      >
                        <OfficialWhatsAppIcon size={15} color="#25D366" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}

                    {inq.status === 'New' ? (
                      <button
                        onClick={() => handleUpdateStatus(inq._id, 'Replied')}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#15803d', borderColor: '#86efac' }}
                        title="Mark as Replied"
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Replied</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(inq._id, 'New')}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.78rem' }}
                        title="Mark as Unread"
                      >
                        <span>Mark as New</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      title="Delete inquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Subject badge */}
                {inq.subject && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        backgroundColor: '#f3ece7',
                        color: 'var(--maroon-800)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '4px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Topic: {inq.subject}
                    </span>
                  </div>
                )}

                {/* Message Body */}
                <div
                  style={{
                    backgroundColor: '#faf6f3',
                    border: '1px solid #eee5df',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    fontSize: '0.92rem',
                    color: '#26050e',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {inq.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
