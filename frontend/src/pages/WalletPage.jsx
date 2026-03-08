import { useEffect, useState } from 'react';
import { FiCreditCard, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wallet').then(r => setWallet(r.data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: 640 }}>
      <h1 className="page-title">My Wallet</h1>

      <div style={{ background: 'linear-gradient(135deg, #e53935, #ff6f00)', borderRadius: 16, padding: '32px 28px', color: '#fff', marginBottom: 28 }}>
        <p style={{ opacity: 0.85, fontSize: 14 }}>Available Balance</p>
        <h2 style={{ fontSize: 42, fontWeight: 800, margin: '8px 0' }}>₹{wallet?.balance?.toLocaleString() || '0'}</h2>
        <p style={{ opacity: 0.75, fontSize: 13 }}>Use at checkout for instant discount</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Transaction History</h3>
        {!wallet?.transactions?.length ? (
          <p style={{ color: '#9e9e9e', textAlign: 'center', padding: 24 }}>No transactions yet</p>
        ) : (
          wallet.transactions.map((tx, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: tx.type === 'credit' ? '#e8f5e9' : '#ffebee',
              }}>
                {tx.type === 'credit' ? <FiArrowDown size={18} color="#2e7d32" /> : <FiArrowUp size={18} color="#e53935" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{tx.description}</p>
                <p style={{ fontSize: 12, color: '#9e9e9e' }}>{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span style={{ fontWeight: 700, color: tx.type === 'credit' ? '#2e7d32' : '#e53935', fontSize: 16 }}>
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
