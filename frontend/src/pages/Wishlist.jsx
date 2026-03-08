import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { addToCart } from '../redux/cartSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Wishlist() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState(user?.wishlist || []);

  const removeFromWishlist = async (productId) => {
    try {
      await api.post(`/users/wishlist/${productId}`);
      setWishlist(w => w.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Added to cart!');
  };

  if (!wishlist.length) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 16px' }}>
        <FiHeart size={64} style={{ color: '#e0e0e0' }} />
        <h2 style={{ marginTop: 16 }}>Your wishlist is empty</h2>
        <p style={{ color: '#9e9e9e', marginBottom: 24 }}>Save products you love!</p>
        <Link to="/products" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 className="page-title">My Wishlist ({wishlist.length})</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {wishlist.map(product => (
          <div key={product._id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <Link to={`/products/${product._id}`}>
              <img src={product.images?.[0]?.url || 'https://placehold.co/300x200'} alt={product.name}
                style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            </Link>
            <div style={{ padding: '12px 14px' }}>
              <Link to={`/products/${product._id}`} style={{ fontWeight: 600, fontSize: 14, color: '#212121' }}>{product.name}</Link>
              <p style={{ color: '#e53935', fontWeight: 700, marginTop: 4 }}>₹{(product.discountPrice || product.price).toLocaleString()}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => handleAddToCart(product)} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <FiShoppingCart size={14} /> Add to Cart
                </button>
                <button onClick={() => removeFromWishlist(product._id)} style={{ background: '#ffebee', color: '#e53935', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
