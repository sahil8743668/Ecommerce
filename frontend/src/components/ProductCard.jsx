import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product: p, skeleton }) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  if (skeleton) return (
    <div style={{ borderRadius: 18, overflow: 'hidden', background: 'var(--card)' }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 14, marginBottom: 8, width: '70%' }} />
        <div className="skeleton" style={{ height: 12, marginBottom: 12, width: '50%' }} />
        <div className="skeleton" style={{ height: 36, borderRadius: 100 }} />
      </div>
    </div>
  );

  const discount = p.price && p.discountPrice ? Math.round((p.price - p.discountPrice) / p.price * 100) : 0;
  const price = p.discountPrice || p.discountPrice === 0 ? p.discountPrice : p.price;
  const imgSrc = p.img || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    dispatch(addToCart({ _id: p._id, name: p.name, price: p.price, discountPrice: p.discountPrice, images: p.img ? [{ url: p.img }] : p.images, stock: p.stock }));
    toast.success('Added to cart! 🛒');
    setTimeout(() => setAdding(false), 600);
  };

  const handleWish = (e) => {
    e.preventDefault(); e.stopPropagation();
    setWished(w => !w);
    toast(wished ? 'Removed from wishlist' : '❤️ Added to wishlist!');
  };

  return (
    <Link to={`/products/${p._id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div className="product-card" style={{ position: 'relative' }}>
        {/* Image */}
        <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: 'var(--bg2)' }}>
          <img src={imgSrc} alt={p.name} className="pimg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Badges */}
          {discount > 0 && (
            <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 100 }}>
              -{discount}%
            </div>
          )}
          {p.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, background: 'rgba(0,0,0,0.7)', padding: '6px 16px', borderRadius: 100 }}>Out of Stock</span>
            </div>
          )}
          {/* Wishlist */}
          <button onClick={handleWish} style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.8)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {wished ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 16px' }}>
          {p.brand && <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>{p.brand.toUpperCase()}</p>}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>
          {p.desc && <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{p.desc}</p>}

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 12, color: s <= Math.round(p.rating || 0) ? '#fbbf24' : 'var(--muted)' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>({(p.reviews || p.numReviews || 0).toLocaleString()})</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>₹{price.toLocaleString()}</span>
            {p.price && p.discountPrice && p.price !== p.discountPrice && (
              <span style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'line-through' }}>₹{p.price.toLocaleString()}</span>
            )}
          </div>

          {/* Add to cart */}
          <button onClick={handleCart} disabled={p.stock === 0 || adding}
            style={{ width: '100%', padding: '10px', borderRadius: 100, border: 'none', background: adding ? '#ccc' : 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontWeight: 700, fontSize: 13, transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onMouseDown={e => !adding && (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={e => !adding && (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => !adding && (e.currentTarget.style.transform = 'scale(1)')}>
            {adding ? '✓ Added!' : p.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
