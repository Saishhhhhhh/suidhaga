import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Check, ShieldCheck } from 'lucide-react';

export default function AdminProfileModal({ isOpen, onClose, token, adminUser, onProfileUpdated }) {
  const [profileData, setProfileData] = useState({
    name: adminUser?.name || 'Komal (Store Owner)',
    email: adminUser?.email || 'admin@suidhaga.com',
    phone: adminUser?.phone || '+91 97730 01771',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (adminUser) {
      setProfileData({
        name: adminUser.name || 'Komal (Store Owner)',
        email: adminUser.email || 'admin@suidhaga.com',
        phone: adminUser.phone || '+91 97730 01771',
      });
    }
  }, [adminUser]);

  if (!isOpen) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMsg(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (data.success && data.admin) {
        setMsg({ type: 'success', text: 'Profile details updated successfully!' });
        localStorage.setItem('suidhaga_admin_user', JSON.stringify(data.admin));
        if (onProfileUpdated) onProfileUpdated(data.admin);
      } else {
        setMsg({ type: 'error', text: data.message || 'Error updating profile' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Error connecting to server' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMsg({ type: 'error', text: 'New password and confirm password do not match' });
      return;
    }

    setSavingPassword(true);
    setMsg(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Admin password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMsg({ type: 'error', text: data.message || 'Error changing password' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update password' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '2.25rem' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '50%',
            color: 'var(--text-dark)',
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--maroon-800)',
              color: 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              border: '2px solid var(--border-gold)',
            }}
          >
            {profileData.name?.[0] || 'K'}
          </div>
          <div>
            <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Admin Profile & Credentials
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
              Manage store ownership profile, contact details, and login password.
            </p>
          </div>
        </div>

        {/* Message Alert */}
        {msg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              backgroundColor: msg.type === 'error' ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${msg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              color: msg.type === 'error' ? '#dc2626' : '#166534',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            {msg.text}
          </div>
        )}

        {/* Section 1: Profile Information */}
        <form onSubmit={handleProfileSubmit} style={{ marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: '1px solid #e7deda' }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--maroon-900)', marginBottom: '1rem' }}>
            Store Owner Details
          </h4>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} color="var(--maroon-800)" />
              <span>Full Name / Title</span>
            </label>
            <input
              type="text"
              required
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="form-input"
              placeholder="Komal (Store Owner)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} color="var(--maroon-800)" />
                <span>Admin Login Email</span>
              </label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="form-input"
                placeholder="admin@suidhaga.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} color="var(--maroon-800)" />
                <span>WhatsApp / Phone</span>
              </label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="form-input"
                placeholder="+91 97730 01771"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" disabled={savingProfile} className="btn btn-primary btn-sm">
              <Check size={15} />
              <span>{savingProfile ? 'Saving...' : 'Update Profile Details'}</span>
            </button>
          </div>
        </form>

        {/* Section 2: Change Password */}
        <form onSubmit={handlePasswordSubmit}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--maroon-900)', marginBottom: '1rem' }}>
            Change Login Password
          </h4>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} color="var(--maroon-800)" />
              <span>Current Password</span>
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="form-input"
              placeholder="Enter current password"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="form-input"
                placeholder="New password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="form-input"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" disabled={savingPassword} className="btn btn-gold btn-sm">
              <ShieldCheck size={15} />
              <span>{savingPassword ? 'Changing...' : 'Change Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
