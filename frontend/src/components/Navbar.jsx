import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { selectCartCount } from '../redux/cartSlice';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const cartCount = useSelector(selectCartCount);
  const [dark, setDark] = useDarkMode();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search}`);
      setSearch('');
    }
  };

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    height: 68,
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid var(--glass-border)',
    boxShadow: 'var(--glass-shadow)'
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Logo */}
        <Link
          to="/"
          style={{
            fontWeight: 900,
            fontSize: 22,
            background: 'linear-gradient(135deg,var(--primary),var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap'
          }}
        >
          A to Z 🛒
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 420, display: 'flex' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1,
              padding: '9px 18px',
              borderRadius: '100px 0 0 100px',
              border: '1.5px solid var(--glass-border)',
              borderRight: 'none',
              background: 'var(--glass-bg)',
              color: 'var(--text)',
              fontSize: 14,
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '9px 18px',
              borderRadius: '0 100px 100px 0',
              border: 'none',
              background: 'linear-gradient(135deg,var(--primary),var(--accent))',
              color: '#fff',
              fontWeight: 700
            }}
          >
            🔍
          </button>
        </form>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>

          <Link to="/products" style={{ padding: '8px 12px' }}>Shop</Link>

          {/* Dark mode */}
          <button
            onClick={() => setDark(d => !d)}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)'
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--primary)',
                  color: '#fff',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >

              {/* Avatar */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--primary),var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {user?.avatar?.url
                  ? <img src={user.avatar.url} style={{ width: 38, height: 38, borderRadius: '50%' }} alt="" />
                  : user?.name?.[0]?.toUpperCase()}
              </div>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  className="glass"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    minWidth: 180,
                    borderRadius: 14,
                    padding: 8,
                    marginTop: 0
                  }}
                >

                  {[
                    { to: '/profile', label: '👤 Profile' },
                    { to: '/orders', label: '📦 Orders' },
                    { to: '/wishlist', label: '❤️ Wishlist' },
                    { to: '/wallet', label: '💰 Wallet' },
                    { to: '/loyalty', label: '⭐ Loyalty' },
                    { to: '/referral', label: '🎁 Refer & Earn' },
                    { to: '/returns', label: '↩️ Returns' },
                    user?.role === 'admin' && { to: '/admin', label: '👑 Admin' }
                  ]
                    .filter(Boolean)
                    .map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        style={{
                          display: 'block',
                          padding: '10px 14px',
                          borderRadius: 10,
                          fontSize: 14
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}

                  <hr />

                  <button
                    onClick={() => dispatch(logout())}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'none',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      textAlign: 'left'
                    }}
                  >
                    🚪 Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '9px 20px' }}>
              Login
            </Link>
          )}

        </div>
      </div>
      {user?.role === "admin" && (
   <Link to="/admin">👑 Admin</Link>
)}
    </nav>
  );
}