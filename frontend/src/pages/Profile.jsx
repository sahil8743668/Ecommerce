import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/change-password', pwForm);
      toast.success('Password changed!');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: 640 }}>
      <h1 className="page-title">My Profile</h1>

      {/* User Info */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e53935', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user?.name}</h2>
            <p style={{ color: '#9e9e9e' }}>{user?.email}</p>
            <span style={{ background: '#ffebee', color: '#e53935', padding: '2px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
            </span>
          </div>
        </div>
        <form onSubmit={updateProfile}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Edit Info</h3>
          <label style={labelStyle}>Full Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <label style={labelStyle}>Email</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
          <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: 8, padding: '10px 28px' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div style={card}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
        <form onSubmit={changePassword}>
          <label style={labelStyle}>Current Password</label>
          <input type="password" value={pwForm.oldPassword}
            onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))}
            style={inputStyle} required />
          <label style={labelStyle}>New Password</label>
          <input type="password" value={pwForm.newPassword}
            onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
            style={inputStyle} required minLength={6} />
          <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: 8, padding: '10px 28px' }}>
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

const card = { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#424242' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'Outfit, sans-serif', outline: 'none', marginBottom: 14, display: 'block' };
