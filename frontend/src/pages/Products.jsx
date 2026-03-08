import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/catalog';

export default function Products() {
  useScrollReveal();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cat = params.get('cat') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || 'default';

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      let res = [...PRODUCTS];
      if (cat) res = res.filter(p => p.category === cat);
      if (search) res = res.filter(p => [p.name,p.brand,p.desc].join(' ').toLowerCase().includes(search.toLowerCase()));
      if (sort === 'price-asc') res.sort((a,b) => (a.discountPrice||a.price)-(b.discountPrice||b.price));
      else if (sort === 'price-desc') res.sort((a,b) => (b.discountPrice||b.price)-(a.discountPrice||a.price));
      else if (sort === 'rating') res.sort((a,b) => (b.rating||0)-(a.rating||0));
      setFiltered(res);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [cat, search, sort]);

  const setF = (k, v) => { const p = new URLSearchParams(params); v ? p.set(k,v) : p.delete(k); setParams(p); };
  const activeCat = CATEGORIES.find(c => c.id === cat);

  const Sidebar = () => (
    <div style={{ background:'var(--card)', backdropFilter:'blur(14px)', border:'1px solid var(--glass-border)', borderRadius:18, padding:20, position:'sticky', top:88 }}>
      <h3 style={{ fontWeight:800, fontSize:15, marginBottom:14, color:'var(--text)' }}>📂 Categories</h3>
      {[{id:'',name:'All Products',icon:'🛍️'}, ...CATEGORIES].map(c=>(
        <button key={c.id} onClick={()=>setF('cat',c.id)} style={{ width:'100%', textAlign:'left', padding:'9px 13px', borderRadius:12, border:'none', background: cat===c.id?'linear-gradient(135deg,var(--primary),var(--accent))':'transparent', color: cat===c.id?'#fff':'var(--text2)', fontSize:13, fontWeight: cat===c.id?700:500, marginBottom:3, cursor:'pointer', transition:'all 0.18s' }}
          onMouseEnter={e=>{if(cat!==c.id)e.currentTarget.style.background='var(--bg2)'}}
          onMouseLeave={e=>{if(cat!==c.id)e.currentTarget.style.background='transparent'}}>
          {c.icon} {c.name}
        </button>
      ))}
      <hr style={{ border:'none', borderTop:'1px solid var(--glass-border)', margin:'14px 0' }} />
      <h3 style={{ fontWeight:800, fontSize:15, marginBottom:14, color:'var(--text)' }}>⬆️ Sort By</h3>
      {[['default','Relevance'],['price-asc','Price: Low → High'],['price-desc','Price: High → Low'],['rating','Top Rated']].map(([v,l])=>(
        <button key={v} onClick={()=>setF('sort',v)} style={{ width:'100%', textAlign:'left', padding:'9px 13px', borderRadius:12, border:'none', background: sort===v?'rgba(229,57,53,0.10)':'transparent', color: sort===v?'var(--primary)':'var(--text2)', fontSize:13, fontWeight: sort===v?700:400, cursor:'pointer', marginBottom:3, transition:'all 0.18s' }}>
          {sort===v&&'✓ '}{l}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ padding:'32px 0 60px' }}>
      <div className="container">
        <div style={{ marginBottom:24 }}>
          <h1 className="page-title" style={{ marginBottom:4 }}>
            {activeCat ? `${activeCat.icon} ${activeCat.name}` : search ? `🔍 "${search}"` : '🛍️ All Products'}
          </h1>
          <p style={{ color:'var(--muted)', fontSize:14 }}>{loading ? 'Loading...' : `${filtered.length} products found`}</p>
        </div>

        <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>
          <aside style={{ width:200, flexShrink:0, display:'block' }}>
            <Sidebar />
          </aside>

          <div style={{ flex:1, minWidth:0 }}>
            {loading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:18 }}>
                {Array(12).fill(0).map((_,i)=><ProductCard key={i} skeleton />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--muted)' }}>
                <div style={{ fontSize:64, marginBottom:16 }}>😕</div>
                <h2 style={{ marginBottom:8, color:'var(--text)' }}>No products found</h2>
                <p>Try a different category or search term</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:18 }}>
                {filtered.map((p,i)=>(
                  <div key={p._id} className="reveal" style={{ transitionDelay:`${Math.min(i,10)*0.04}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
