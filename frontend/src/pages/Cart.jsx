import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { removeFromCart, updateQuantity, selectCartTotal } from '../redux/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);
  const total = useSelector(selectCartTotal);

  const shipping = total > 499 ? 0 : 49;
  const tax = Math.round(total * 0.18);

  const handleCheckout = () => {
    if (!isAuthenticated) return navigate('/login?redirect=checkout');
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 16px' }}>
        <p style={{ fontSize: 72 }}>🛒</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: '#9e9e9e', marginBottom: 24 }}>Add some products to get started!</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 className="page-title">Shopping Cart ({items.length} items)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr min(340px, 100%)', gap: 24, alignItems: 'start' }}>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(item => (
            <div key={item._id} style={cartItem}>
              <img src={item.images?.[0]?.url || 'https://placehold.co/80x80'} alt={item.name}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item._id}`} style={{ fontWeight: 600, fontSize: 15, color: '#212121' }}>{item.name}</Link>
                <p style={{ color: '#e53935', fontWeight: 700, marginTop: 4 }}>
                  ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e0e0e0', borderRadius: 8 }}>
                <button onClick={() => {
                  if (item.quantity === 1) dispatch(removeFromCart(item._id));
                  else dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
                }} style={qtyBtn}>−</button>
                <span style={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: Math.min(item.stock, item.quantity + 1) }))}
                  style={qtyBtn}>+</button>
              </div>
              <button onClick={() => dispatch(removeFromCart(item._id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef5350' }}>
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
          <div style={summaryRow}><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
          <div style={summaryRow}><span>Shipping</span><span style={{ color: shipping === 0 ? '#2e7d32' : undefined }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <div style={summaryRow}><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
          {shipping > 0 && <p style={{ fontSize: 12, color: '#9e9e9e', margin: '-8px 0 12px' }}>Add ₹{(499 - total).toLocaleString()} more for free shipping</p>}
          <div style={{ ...summaryRow, fontWeight: 700, fontSize: 18, borderTop: '2px solid #e0e0e0', paddingTop: 16, marginTop: 8 }}>
            <span>Total</span><span style={{ color: '#e53935' }}>₹{(total + shipping + tax).toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: 14, fontSize: 16 }}>
            <FiShoppingBag size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Proceed to Checkout
          </button>
          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#9e9e9e', fontSize: 14 }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

const cartItem = {
  background: '#fff', borderRadius: 12, padding: 16,
  display: 'flex', alignItems: 'center', gap: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};
const qtyBtn = { background: 'none', border: 'none', padding: '6px 12px', fontSize: 18, cursor: 'pointer' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 };
