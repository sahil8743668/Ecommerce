import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function LoyaltyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/loyalty').then(r => setData(r.data)).catch(() => toast.error('Failed'));
  }, []);

  if (!data) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: 640 }}>
      <h1 className="page-title">⭐ Loyalty Points</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Available Points', value: data.points, color: '#e53935', note: `= ₹${data.points} discount` },
          { label: 'Total Earned', value: data.totalEarned, color: '#2e7d32', note: 'lifetime' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderTop: `3px solid ${s.color}` }}>
            <p style={{ color: '#9e9e9e', fontSize: 13 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color, margin: '4px 0' }}>{s.value}</p>
            <p style={{ fontSize: 12, color: '#9e9e9e' }}>{s.note}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff3e0', borderRadius: 12, padding: 16, marginBottom: 28, border: '1px solid #ffe0b2' }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>💡 How it works</p>
        <p style={{ fontSize: 13, color: '#424242' }}>Earn 1 point for every ₹10 spent. 1 point = ₹1 discount at checkout. Max 20% of order can be paid with points.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Points History</h3>
        {!data.history?.length ? (
          <p style={{ color: '#9e9e9e', textAlign: 'center', padding: 24 }}>No history yet</p>
        ) : data.history.map((h, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{h.description}</p>
              <p style={{ fontSize: 12, color: '#9e9e9e' }}>{new Date(h.createdAt).toLocaleDateString()}</p>
            </div>
            <span style={{ fontWeight: 700, color: h.type === 'earned' ? '#2e7d32' : '#e53935' }}>
              {h.type === 'earned' ? '+' : '-'}{h.points} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
