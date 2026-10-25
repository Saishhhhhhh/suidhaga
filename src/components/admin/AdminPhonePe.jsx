import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  CreditCard,
  Lock,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export default function AdminPhonePe({ token }) {
  const [settings, setSettings] = useState({
    clientId: 'SU2601211253462517219180',
    clientSecretMasked: '6b3d01f9...41fb',
    hasClientSecret: true,
    merchantId: 'M23I7XG44NMD3',
    merchantName: 'SUI DHAGA',
    clientVersion: '1',
    env: 'production',
    status: 'ACTIVE',
  });

  const [editForm, setEditForm] = useState({
    clientId: 'SU2601211253462517219180',
    clientSecret: '',
    merchantId: 'M23I7XG44NMD3',
    merchantName: 'SUI DHAGA',
    clientVersion: '1',
    env: 'production',
  });

  const [showSecret, setShowSecret] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalTransactions: 0, paidCount: 0, totalVolume: 0 });
  const [loadingTxns, setLoadingTxns] = useState(true);
  const [verifyingOrder, setVerifyingOrder] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/payment/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        setEditForm((prev) => ({
          ...prev,
          clientId: data.settings.clientId,
          merchantId: data.settings.merchantId,
          merchantName: data.settings.merchantName,
          clientVersion: data.settings.clientVersion,
          env: data.settings.env,
        }));
      }
    } catch (err) {
      console.error('Error fetching PhonePe settings:', err);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTxns(true);
    try {
      const res = await fetch('/api/payment/admin/transactions');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoadingTxns(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchTransactions();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/payment/admin/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: editForm.clientId,
          clientSecret: editForm.clientSecret || undefined,
          merchantId: editForm.merchantId,
          env: editForm.env,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Could not connect to PhonePe gateway endpoint.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const payload = { ...editForm };
      if (!payload.clientSecret) {
        delete payload.clientSecret; // Keep existing secret if blank
      }

      const res = await fetch('/api/payment/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage({ type: 'success', text: 'PhonePe Gateway settings saved successfully!' });
        fetchSettings();
      } else {
        setSaveMessage({ type: 'error', text: data.message || 'Error saving settings' });
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Failed to update gateway settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleVerifyOrder = async (orderId) => {
    setVerifyingOrder(orderId);
    try {
      const res = await fetch(`/api/payment/phonepe/status/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (data.success) {
        fetchTransactions();
      }
    } catch (err) {
      console.error('Error verifying order:', err);
    } finally {
      setVerifyingOrder(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner Card */}
      <div
        className="card-luxury"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#5f259f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(95, 37, 159, 0.35)',
            }}
          >
            <ShieldCheck size={32} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                PhonePe Payment Gateway
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#ecfdf5',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    boxShadow: '0 0 6px #16a34a',
                  }}
                />
                LIVE & CONNECTED
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
              Standard Checkout V2 API integration • Supports UPI, QR Code, Cards & NetBanking
            </p>
          </div>
        </div>

        {/* 1-Click Connection Test Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="btn btn-primary"
            style={{
              backgroundColor: '#5f259f',
              borderColor: '#5f259f',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.4rem',
            }}
          >
            <Zap size={16} />
            <span>{testing ? 'Pinging PhonePe...' : 'Test Live Connection'}</span>
          </button>
        </div>
      </div>

      {/* Diagnostics Alert */}
      {testResult && (
        <div
          className="animate-fade-in"
          style={{
            backgroundColor: testResult.success ? '#ecfdf5' : '#fef2f2',
            border: `1.5px solid ${testResult.success ? '#86efac' : '#fca5a5'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          {testResult.success ? (
            <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: testResult.success ? '#166534' : '#991b1b', fontSize: '0.95rem' }}>
              {testResult.message}
            </div>
            {testResult.success && (
              <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.3rem' }}>
                • Gateway Response Latency: <strong>{testResult.latencyMs} ms</strong>
                <br />
                • Merchant Verified: <strong>{testResult.merchantName} ({testResult.merchantId})</strong>
                <br />
                • Active Environment: <strong>{testResult.env.toUpperCase()}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="card-luxury" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Merchant ID</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--maroon-900)', marginTop: '0.3rem' }}>
            {settings.merchantId}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{settings.merchantName}</span>
        </div>

        <div className="card-luxury" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Environment</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#5f259f', marginTop: '0.3rem' }}>
            {settings.env === 'production' ? 'PRODUCTION (LIVE)' : 'SANDBOX (UAT)'}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>api.phonepe.com</span>
        </div>

        <div className="card-luxury" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total PhonePe Orders</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--maroon-900)', marginTop: '0.3rem' }}>
            {stats.totalTransactions} Orders
          </div>
          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{stats.paidCount} Paid</span>
        </div>

        <div className="card-luxury" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Volume</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a', marginTop: '0.3rem' }}>
            ₹{stats.totalVolume.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Processed</span>
        </div>
      </div>

      {/* Settings & Credentials Manager */}
      <div
        className="card-luxury"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          Gateway Credentials & Configuration
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          These live keys authenticate Sui Dhaga orders directly with PhonePe's identity manager.
        </p>

        {saveMessage && (
          <div
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              backgroundColor: saveMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: saveMessage.type === 'success' ? '#166534' : '#991b1b',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            {saveMessage.text}
          </div>
        )}

        <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              Merchant ID
            </label>
            <input
              type="text"
              value={editForm.merchantId}
              onChange={(e) => setEditForm({ ...editForm, merchantId: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              Merchant Name
            </label>
            <input
              type="text"
              value={editForm.merchantName}
              onChange={(e) => setEditForm({ ...editForm, merchantName: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              Client ID
            </label>
            <input
              type="text"
              value={editForm.clientId}
              onChange={(e) => setEditForm({ ...editForm, clientId: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              <span>Client Secret</span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                style={{ background: 'none', border: 'none', color: '#5f259f', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
              >
                {showSecret ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showSecret ? 'Hide' : 'Show / Edit'}</span>
              </button>
            </label>
            <input
              type={showSecret ? 'text' : 'password'}
              value={editForm.clientSecret}
              placeholder={settings.hasClientSecret ? `Active (${settings.clientSecretMasked})` : 'Enter Client Secret'}
              onChange={(e) => setEditForm({ ...editForm, clientSecret: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              Client Version
            </label>
            <input
              type="text"
              value={editForm.clientVersion}
              onChange={(e) => setEditForm({ ...editForm, clientVersion: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              Environment
            </label>
            <select
              value={editForm.env}
              onChange={(e) => setEditForm({ ...editForm, env: e.target.value })}
              className="form-input"
            >
              <option value="production">Production (api.phonepe.com) - LIVE</option>
              <option value="sandbox">Sandbox (api-preprod.phonepe.com) - TEST</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save & Update Credentials'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* PhonePe Live Transactions Table */}
      <div
        className="card-luxury"
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              PhonePe Orders & Transactions
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
              Live customer transactions initiated via PhonePe Payment Gateway
            </p>
          </div>
          <button
            onClick={fetchTransactions}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>

        {loadingTxns ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            <CreditCard size={36} color="var(--border-gold)" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 600 }}>No PhonePe transactions recorded yet.</div>
            <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
              When customers complete checkout via PhonePe on the storefront, transactions will appear here in real time.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--ivory-surface)', borderBottom: '2px solid var(--border-gold)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                  <th style={{ padding: '0.85rem 1rem' }}>PhonePe Ref</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Payment Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} style={{ borderBottom: '1px solid #ede4dc' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--maroon-900)' }}>
                      {txn.orderId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{txn.customer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{txn.customer?.phone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#16a34a' }}>
                      ₹{txn.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#5f259f' }}>
                      {txn.phonePeTransactionId || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor:
                            txn.paymentStatus === 'Paid'
                              ? '#dcfce7'
                              : txn.paymentStatus === 'Failed'
                              ? '#fee2e2'
                              : '#fef3c7',
                          color:
                            txn.paymentStatus === 'Paid'
                              ? '#166534'
                              : txn.paymentStatus === 'Failed'
                              ? '#991b1b'
                              : '#b45309',
                        }}
                      >
                        {txn.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(txn.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleVerifyOrder(txn.orderId)}
                        disabled={verifyingOrder === txn.orderId}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.74rem', padding: '0.3rem 0.7rem' }}
                        title="Query PhonePe API directly for latest payment status"
                      >
                        {verifyingOrder === txn.orderId ? 'Checking...' : 'Verify Status'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
