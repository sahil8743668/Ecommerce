import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: '#ff9800', approved: '#4caf50', rejected: '#f44336', completed: '#9c27b0' };
const REASONS = ['Wrong item received', 'Item damaged', 'Not as described', 'Size issue', 'Changed my mind', 'Other'];

export default function ReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: '', reason: REASONS[0], description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/returns/my-returns').then(r => setReturns(r.data.returns));
    api.get('/orders/my-orders').then(r => setOrders(r.data.orders.filter(o => o.orderStatus === 'delivered')));
  }, []);

  const submitReturn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/returns', form);
      setReturns(prev => [data.return, ...prev]);
      setShowForm(false);
      toast.success('Return request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Returns & Refunds</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ padding: '10px 20px' }}>
          {showForm ? 'Cancel' : '+ New Return'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitReturn} style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Request a Return</h3>
          <label style={labelStyle}>Select Order</label>
          <select value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))} style={inputStyle} required>
            <option value="">-- Select delivered order --</option>
            {orders.map(o => <option key={o._id} value={o._id}>Order #{o._id.slice(-8).toUpperCase()} — ₹{o.totalPrice}</option>)}
          </select>
          <label style={labelStyle}>Reason</label>
          <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} style={inputStyle}>
            {REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe the issue..." />
          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 12, padding: '10px 28px' }}>
            {loading ? 'Submitting...' : 'Submit Return Request'}
          </button>
        </form>
      )}

      {returns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9e9e9e' }}>
          <p style={{ fontSize: 48 }}>↩️</p>
          <p style={{ marginTop: 12 }}>No return requests yet</p>
        </div>
      ) : (
        returns.map(ret => (
          <div key={ret._id} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#9e9e9e' }}>Return #{ret._id.slice(-8).toUpperCase()}</p>
                <p style={{ fontWeight: 700, marginTop: 4 }}>{ret.reason}</p>
                {ret.description && <p style={{ fontSize: 13, color: '#757575', marginTop: 4 }}>{ret.description}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: `${STATUS_COLORS[ret.status]}22`, color: STATUS_COLORS[ret.status], padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                </span>
                {ret.refundAmount && <p style={{ fontSize: 16, fontWeight: 700, color: '#2e7d32', marginTop: 6 }}>₹{ret.refundAmount} refund</p>}
              </div>
            </div>
            {ret.adminNote && <p style={{ marginTop: 10, padding: 10, background: '#f5f5f5', borderRadius: 8, fontSize: 13 }}>Admin: {ret.adminNote}</p>}
          </div>
        ))
      )}
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, marginTop: 14, color: '#424242' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'Outfit, sans-serif', outline: 'none' };
