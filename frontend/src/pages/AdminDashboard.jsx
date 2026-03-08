import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { getAdminStats } from '../utils/adminApi';

const TABS = ['Overview', 'Products', 'Orders', 'Users'];
const STATUS_OPTIONS = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Load stats from backend
  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data.stats);
    } catch {
      toast.error('Failed to load stats');
    }
  };

  // Tab आधारित data loading
  useEffect(() => {
    if (tab === 0) {
      loadStats();
    }

    if (tab === 1) {
      api.get('/products')
        .then(r => setProducts(r.data.products))
        .catch(() => toast.error('Failed to load products'));
    }

    if (tab === 2) {
      api.get('/orders')
        .then(r => setOrders(r.data.orders))
        .catch(() => toast.error('Failed to load orders'));
    }

    if (tab === 3) {
      api.get('/users')
        .then(r => setUsers(r.data.users))
        .catch(() => toast.error('Failed to load users'));
    }

  }, [tab]);

  // Order status update
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });

      setOrders(o =>
        o.map(or =>
          or._id === orderId ? { ...or, orderStatus: status } : or
        )
      );

      toast.success('Status updated!');
    } catch {
      toast.error('Failed');
    }
  };

  // Product delete
  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts(p => p.filter(pr => pr._id !== id));

      toast.success('Product deleted');
    } catch {
      toast.error('Failed');
    }
  };

  // User delete
  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);

      setUsers(u => u.filter(us => us._id !== id));

      toast.success('User deleted');
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 className="page-title">👑 Admin Dashboard</h1>

      {/* Tabs */}
      <div style={tabBar}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              ...tabButton,
              background: tab === i ? '#e53935' : 'transparent',
              color: tab === i ? '#fff' : '#757575',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 0 && stats && (
        <div style={grid}>
          {[
            {
              label: 'Total Revenue',
              value: `₹${stats.totalRevenue?.toLocaleString()}`,
              icon: '💰',
              color: '#e53935',
            },
            {
              label: 'Total Orders',
              value: stats.totalOrders,
              icon: '📦',
              color: '#1976d2',
            },
            {
              label: 'Products',
              value: stats.totalProducts,
              icon: '🛍',
              color: '#7b1fa2',
            },
            {
              label: 'Users',
              value: stats.totalUsers,
              icon: '👥',
              color: '#388e3c',
            },
          ].map(s => (
            <div
              key={s.label}
              style={{
                ...card,
                borderTop: `3px solid ${s.color}`,
              }}
            >
              <div style={{ fontSize: 36 }}>{s.icon}</div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: s.color,
                  marginTop: 8,
                }}
              >
                {s.value}
              </div>

              <div
                style={{
                  color: '#9e9e9e',
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {tab === 1 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {['Image', 'Name', 'Price', 'Stock', 'Category', 'Actions'].map(
                  h => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {products.map(p => (
                <tr key={p._id} style={rowStyle}>
                  <td style={tdStyle}>
                    <img
                      src={p.images?.[0]?.url}
                      alt=""
                      style={imageStyle}
                    />
                  </td>

                  <td style={tdStyle}>{p.name.slice(0, 40)}</td>

                  <td style={tdStyle}>
                    ₹{(p.discountPrice || p.price).toLocaleString()}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        color: p.stock > 0 ? '#2e7d32' : '#c62828',
                        fontWeight: 600,
                      }}
                    >
                      {p.stock}
                    </span>
                  </td>

                  <td style={tdStyle}>{p.category?.name}</td>

                  <td style={tdStyle}>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      style={dangerBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders */}
      {tab === 2 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {[
                  'Order ID',
                  'Customer',
                  'Total',
                  'Payment',
                  'Status',
                  'Update',
                ].map(h => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders.map(o => (
                <tr key={o._id} style={rowStyle}>
                  <td style={tdStyle}>
                    #{o._id.slice(-8).toUpperCase()}
                  </td>

                  <td style={tdStyle}>{o.user?.name}</td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: 700,
                      color: '#e53935',
                    }}
                  >
                    ₹{o.totalPrice.toLocaleString()}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        color:
                          o.paymentStatus === 'paid'
                            ? '#2e7d32'
                            : '#ff9800',
                        fontWeight: 600,
                      }}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td style={tdStyle}>{o.orderStatus}</td>

                  <td style={tdStyle}>
                    <select
                      value={o.orderStatus}
                      onChange={e =>
                        updateStatus(o._id, e.target.value)
                      }
                      style={selectStyle}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users */}
      {tab === 3 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(
                  h => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {users.map(u => (
                <tr key={u._id} style={rowStyle}>
                  <td style={tdStyle}>{u.name}</td>

                  <td style={tdStyle}>{u.email}</td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        background:
                          u.role === 'admin'
                            ? '#fff3e0'
                            : '#f3e5f5',
                        color:
                          u.role === 'admin'
                            ? '#e65100'
                            : '#6a1b9a',
                        padding: '2px 10px',
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td style={tdStyle}>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(u._id)}
                        style={dangerBtn}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* Styles */

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 20,
};

const card = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
};

const tabBar = {
  display: 'flex',
  gap: 4,
  background: '#fff',
  padding: 6,
  borderRadius: 10,
  marginBottom: 28,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  flexWrap: 'wrap',
};

const tabButton = {
  padding: '10px 20px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Outfit, sans-serif',
  fontSize: 14,
  fontWeight: 600,
};

const tableStyle = {
  width: '100%',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  borderCollapse: 'collapse',
};

const thStyle = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 13,
  fontWeight: 700,
  color: '#757575',
  background: '#fafafa',
  borderBottom: '1px solid #e0e0e0',
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: 14,
  verticalAlign: 'middle',
};

const rowStyle = {
  borderBottom: '1px solid #f5f5f5',
};

const imageStyle = {
  width: 44,
  height: 44,
  objectFit: 'cover',
  borderRadius: 6,
};

const selectStyle = {
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #e0e0e0',
  fontSize: 13,
  cursor: 'pointer',
};

const dangerBtn = {
  background: '#ffebee',
  color: '#e53935',
  border: 'none',
  borderRadius: 6,
  padding: '6px 14px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
};