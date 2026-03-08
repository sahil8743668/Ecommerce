import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const ids = searchParams.get('ids');

  useEffect(() => {
    if (ids) api.get(`/products/compare?ids=${ids}`).then(r => setProducts(r.data.products));
  }, [ids]);

  if (!ids) {
    return (
      <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 48 }}>📊</p>
        <h2>Compare Products</h2>
        <p style={{ color: '#9e9e9e', marginTop: 8 }}>Go to product pages and select "Compare" to compare products side by side.</p>
        <Link to="/products" className="btn-primary" style={{ display: 'inline-block', marginTop: 20 }}>Browse Products</Link>
      </div>
    );
  }

  const FIELDS = [
    { key: 'price', label: 'Price', render: (p) => `₹${(p.discountPrice || p.price).toLocaleString()}` },
    { key: 'ratings', label: 'Rating', render: (p) => `${p.ratings?.toFixed(1)} ★ (${p.numReviews})` },
    { key: 'stock', label: 'Stock', render: (p) => p.stock > 0 ? `${p.stock} units` : 'Out of stock' },
    { key: 'brand', label: 'Brand', render: (p) => p.brand || '—' },
    { key: 'category', label: 'Category', render: (p) => p.category?.name || '—' },
    { key: 'sold', label: 'Units Sold', render: (p) => p.sold || 0 },
  ];

  return (
    <div className="container" style={{ padding: '32px 16px', overflowX: 'auto' }}>
      <h1 className="page-title">Compare Products</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: 140 }}>Feature</th>
            {products.map(p => (
              <th key={p._id} style={thStyle}>
                <img src={p.images?.[0]?.url} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
                <Link to={`/products/${p._id}`} style={{ fontWeight: 700, fontSize: 14, color: '#212121' }}>{p.name}</Link>
                <button onClick={() => { dispatch(addToCart(p)); toast.success('Added!'); }} className="btn-primary" style={{ width: '100%', marginTop: 10, padding: '8px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <FiShoppingCart size={14} /> Add to Cart
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIELDS.map(field => (
            <tr key={field.key} style={{ borderTop: '1px solid #f5f5f5' }}>
              <td style={{ ...tdStyle, fontWeight: 700, color: '#757575', background: '#fafafa' }}>{field.label}</td>
              {products.map(p => (
                <td key={p._id} style={tdStyle}>{field.render(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: '20px 16px', textAlign: 'center', fontWeight: 700, color: '#757575', background: '#fafafa', borderBottom: '2px solid #e0e0e0', verticalAlign: 'top' };
const tdStyle = { padding: '14px 16px', textAlign: 'center', fontSize: 14 };
