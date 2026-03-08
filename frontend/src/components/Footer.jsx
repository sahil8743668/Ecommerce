import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#212121', color: '#bdbdbd', marginTop: 60 }}>
      <div className="container" style={{ padding: '40px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
        <div>
          <h3 style={{ color: '#e53935', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>🛒 A to Z Cart</h3>
          <p style={{ fontSize: 14, lineHeight: 1.8 }}>Your one-stop destination for everything you need. Quality products at the best prices.</p>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Quick Links</h4>
          {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
            <div key={to}><Link to={to} style={{ color: '#bdbdbd', fontSize: 14, display: 'block', marginBottom: 6 }}>{label}</Link></div>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Account</h4>
          {[['/login', 'Login'], ['/register', 'Register'], ['/profile', 'Profile']].map(([to, label]) => (
            <div key={to}><Link to={to} style={{ color: '#bdbdbd', fontSize: 14, display: 'block', marginBottom: 6 }}>{label}</Link></div>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Contact</h4>
          <p style={{ fontSize: 14, marginBottom: 6 }}>📧 support@atozcart.com</p>
          <p style={{ fontSize: 14, marginBottom: 6 }}>📞 1800-000-0000</p>
          <p style={{ fontSize: 14 }}>🕐 Mon-Sat 9AM - 6PM</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #333', textAlign: 'center', padding: '16px', fontSize: 13 }}>
        © {new Date().getFullYear()} A to Z Cart. All rights reserved.
      </div>
    </footer>
  );
}
