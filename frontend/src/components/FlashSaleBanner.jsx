import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import api from '../utils/api';

function useCountdown(endTime) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(endTime) - new Date());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return timeLeft;
}

export default function FlashSaleBanner() {
  const [sale, setSale] = useState(null);

  useEffect(() => {
    api.get('/banners/flash-sale').then(r => setSale(r.data.sale)).catch(() => {});
  }, []);

  const { h, m, s } = useCountdown(sale?.endTime);

  if (!sale) return null;

  return (
    <section style={{ background: '#1a1a2e', padding: '32px 16px' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>⚡ {sale.title}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Hours', h], ['Min', m], ['Sec', s]].map(([label, val]) => (
              <div key={label} style={{ background: '#e53935', borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 56 }}>
                <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{String(val).padStart(2, '0')}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        {sale.products?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {sale.products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
