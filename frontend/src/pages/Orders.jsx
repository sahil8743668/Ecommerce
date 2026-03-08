import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLOR = {
  processing: '#ff9800', confirmed: '#2196f3', shipped: '#9c27b0',
  delivered: '#4caf50', cancelled: '#f44336',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(r => setOrders(r.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontSize: 60 }}>📦</p>
          <h2 style={{ marginTop: 16, marginBottom: 8 }}>No orders yet</h2>
          <p style={{ color: '#9e9e9e' }}>Your orders will appear here once you place them.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#9e9e9e' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p style={{ fontSize: 13, color: '#9e9e9e' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: STATUS_COLOR[order.orderStatus] + '22', color: STATUS_COLOR[order.orderStatus], padding: '4px 12px', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#e53935', marginTop: 6 }}>₹{order.totalPrice.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {order.orderItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 8, padding: '8px 12px' }}>
                    {item.image && <img src={item.image} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />}
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: '#9e9e9e' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
