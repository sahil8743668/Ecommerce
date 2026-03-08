import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiShare2, FiCopy, FiCheck, FiUsers } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ReferralPage() {
  const { user } = useSelector(s => s.auth);
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/referral/my-code').then(r => setData(r.data)).catch(() => toast.error('Failed'));
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${data?.code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`🛒 Join A to Z Cart and get ₹50 off! Use my link: ${referralLink}`)}`);
  };

  if (!data) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: 600 }}>
      <h1 className="page-title">🎁 Refer & Earn</h1>

      <div style={{ background: 'linear-gradient(135deg, #e53935, #ff6f00)', borderRadius: 16, padding: 28, color: '#fff', textAlign: 'center', marginBottom: 24 }}>
        <p style={{ fontSize: 18, opacity: 0.9 }}>You + Friend both get</p>
        <p style={{ fontSize: 48, fontWeight: 800 }}>₹50</p>
        <p style={{ opacity: 0.85 }}>when your friend places their first order!</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 12 }}>Your Referral Code</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#f5f5f5', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: 3, flex: 1 }}>{data.code}</span>
          <button onClick={copyLink} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={copyLink} className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <FiShare2 size={16} /> Share Link
          </button>
          <button onClick={shareWhatsApp} style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            📱 WhatsApp
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiUsers size={20} color="#e53935" />
            <span style={{ fontWeight: 600 }}>Friends Referred</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#e53935' }}>{data.referredCount}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontWeight: 600 }}>Total Earned</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#2e7d32' }}>₹{data.totalEarned}</span>
        </div>
      </div>
    </div>
  );
}
