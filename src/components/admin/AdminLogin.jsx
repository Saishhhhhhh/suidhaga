import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBackToStore }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('suidhaga_admin_token', data.token);
        localStorage.setItem('suidhaga_admin_user', JSON.stringify(data.admin));
        onLoginSuccess(data.admin, data.token);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Cannot connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: `radial-gradient(circle at center, #4a0d1a 0%, #26050e 100%)`,
      }}
    >
      <div
        className="card-luxury animate-fade-in"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '2.5rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          border: '1.5px solid var(--border-gold)',
        }}
      >
        {/* Brand Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/assets/logo.webp"
            alt="Sui Dhaga Logo"
            style={{ height: '64px', margin: '0 auto 1rem', display: 'block' }}
          />
          <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            SUI-DHAGA Admin
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Owner & Store Management Portal
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={15} color="var(--maroon-800)" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@suidhaga.com"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={15} color="var(--maroon-800)" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.8rem',
            backgroundColor: 'var(--ivory-surface)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            border: '1px dashed var(--border-delicate)',
          }}
        >
          <div><strong>Default Admin Credentials:</strong></div>
          <div>Email: <code>admin@suidhaga.com</code> | Password: <code>admin123</code></div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={onBackToStore}
            style={{ background: 'none', border: 'none', color: 'var(--maroon-800)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            ← Return to Customer Store
          </button>
        </div>

      </div>
    </div>
  );
}
