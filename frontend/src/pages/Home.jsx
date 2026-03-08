import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, FEATURED, DEALS, getByCat } from '../data/catalog';

// ── BANNERS ──
const BANNERS = [
  { id:1, headline:'New Season, New Style', sub:'Up to 70% off on Fashion', cta:'Shop Fashion', link:'/products?cat=fashion', gradient:'135deg,#ff6584 0%,#ff8e53 100%', emoji:'👗' },
  { id:2, headline:'Top Mobiles of 2025', sub:'iPhone, Samsung, OnePlus & more', cta:'Explore Mobiles', link:'/products?cat=mobiles', gradient:'135deg,#6c63ff 0%,#3a86ff 100%', emoji:'📱' },
  { id:3, headline:'Sports Mega Sale', sub:'Gear up for greatness', cta:'Shop Sports', link:'/products?cat=sports', gradient:'135deg,#43e97b 0%,#38f9d7 100%', emoji:'⚽' },
  { id:4, headline:'Home & Kitchen Deals', sub:'Make your home beautiful', cta:'Shop Now', link:'/products?cat=home', gradient:'135deg,#fa8231 0%,#f7b733 100%', emoji:'🏠' },
];

function useCountdown(target) {
  const [left, setLeft] = useState({ h:0, m:0, s:0 });
  useEffect(() => {
    const end = new Date(); end.setHours(23,59,59,0);
    const tick = () => {
      const d = Math.max(0, end - new Date());
      setLeft({ h:Math.floor(d/3600000), m:Math.floor((d%3600000)/60000), s:Math.floor((d%60000)/1000) });
    };
    tick(); const id = setInterval(tick,1000); return()=>clearInterval(id);
  },[]);
  return left;
}

export default function Home() {
  useScrollReveal();
  const videoRef = useRef();
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown();

  // Auto slider
  useEffect(() => { const id = setInterval(()=>setSlide(s=>(s+1)%BANNERS.length), 4000); return()=>clearInterval(id); },[]);

  // Simulate loading
  useEffect(() => { setTimeout(()=>setLoading(false), 1200); },[]);

  const b = BANNERS[slide];
  const discount = p => p.price&&p.discountPrice ? Math.round((p.price-p.discountPrice)/p.price*100) : 0;

  return (
    <div>

      {/* ═══ HERO — Video BG + Glassmorphism ═══ */}
      <section style={{ position:'relative', height:'92vh', minHeight:560, overflow:'hidden', display:'flex', alignItems:'center' }}>
        {/* Video Background */}
        <video ref={videoRef} autoPlay muted loop playsInline
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}
          poster="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80">
          <source src="https://cdn.coverr.co/videos/coverr-a-man-and-woman-shopping-6670/1080p.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.35) 60%,rgba(229,57,53,0.20) 100%)', zIndex:1 }} />
        {/* Animated color blobs */}
        <div style={{ position:'absolute', top:'10%', right:'8%', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle,rgba(229,57,53,0.3),transparent 70%)', animation:'blob1 6s ease-in-out infinite', zIndex:1 }} />
        <div style={{ position:'absolute', bottom:'5%', left:'5%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(108,99,255,0.25),transparent 70%)', animation:'blob2 8s ease-in-out infinite', zIndex:1 }} />
        <style>{`
          @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,20px) scale(1.1)} }
          @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.15)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        `}</style>

        {/* Hero Content — Glass Card */}
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div style={{ maxWidth:600 }}>
            <div style={{ display:'inline-block', background:'rgba(229,57,53,0.20)', backdropFilter:'blur(10px)', border:'1px solid rgba(229,57,53,0.35)', borderRadius:100, padding:'6px 18px', fontSize:13, fontWeight:700, color:'#ffb3b0', marginBottom:20, letterSpacing:0.5, animation:'fadeUp 0.6s ease both' }}>
              🔥 BIGGEST SALE OF THE YEAR
            </div>
            <h1 style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:900, color:'#fff', lineHeight:1.08, marginBottom:20, animation:'fadeUp 0.7s ease 0.1s both' }}>
              Everything<br/>
              <span style={{ background:'linear-gradient(135deg,#e53935,#ff6f00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                A to Z
              </span><br/>
              Delivered
            </h1>
            <p style={{ fontSize:18, color:'rgba(255,255,255,0.78)', marginBottom:32, lineHeight:1.6, animation:'fadeUp 0.7s ease 0.2s both' }}>
              10 categories · 1000+ products · Free delivery above ₹499
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', animation:'fadeUp 0.7s ease 0.3s both' }}>
              <Link to="/products" className="btn-primary" style={{ fontSize:16, padding:'14px 36px' }}>Shop Now →</Link>
              <Link to="/products?cat=mobiles" className="btn-glass" style={{ fontSize:16, padding:'14px 32px', color:'#fff', border:'1px solid rgba(255,255,255,0.35)' }}>📱 View Mobiles</Link>
            </div>
            {/* Quick stats */}
            <div style={{ display:'flex', gap:28, marginTop:44, animation:'fadeUp 0.7s ease 0.4s both' }}>
              {[['50k+','Happy Customers'],['1000+','Products'],['10','Categories'],['Free','Delivery 499+']].map(([n,l])=>(
                <div key={l}>
                  <div style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{n}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Glass Card — Right side */}
        <div style={{ position:'absolute', right:'5%', top:'50%', transform:'translateY(-50%)', zIndex:2, display:'flex', flexDirection:'column', gap:12 }}>
          {['📱 New Arrivals', '🔥 Hot Deals', '🎁 Gifts'].map((item,i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:14, padding:'12px 20px', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.2s', animation:`fadeUp 0.7s ease ${0.3+i*0.1}s both` }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.22)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}>
              {item}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{ width:24, height:40, border:'2px solid rgba(255,255,255,0.4)', borderRadius:100, display:'flex', justifyContent:'center', paddingTop:6 }}>
            <div style={{ width:4, height:8, background:'rgba(255,255,255,0.7)', borderRadius:100, animation:'scrollDot 1.5s ease-in-out infinite' }} />
          </div>
          <style>{`@keyframes scrollDot{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(8px);opacity:0.4}}`}</style>
        </div>
      </section>

      {/* ═══ AUTO BANNER SLIDER ═══ */}
      <section style={{ background:'var(--bg)', padding:'40px 0 0' }}>
        <div className="container">
          <div style={{ position:'relative', borderRadius:24, overflow:'hidden', height:200 }}>
            {BANNERS.map((bn,i)=>(
              <div key={bn.id} style={{ position:'absolute', inset:0, background:`linear-gradient(${bn.gradient})`, display:'flex', alignItems:'center', padding:'0 48px', transition:'opacity 0.6s ease, transform 0.6s ease', opacity: i===slide?1:0, transform: i===slide?'scale(1)':'scale(1.03)', pointerEvents: i===slide?'auto':'none' }}>
                <div>
                  <div style={{ fontSize:56, marginBottom:8 }}>{bn.emoji}</div>
                  <h2 style={{ color:'#fff', fontSize:28, fontWeight:800, marginBottom:6 }}>{bn.headline}</h2>
                  <p style={{ color:'rgba(255,255,255,0.85)', fontSize:15, marginBottom:16 }}>{bn.sub}</p>
                  <Link to={bn.link} style={{ background:'rgba(255,255,255,0.22)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.35)', color:'#fff', padding:'10px 24px', borderRadius:100, fontSize:14, fontWeight:700, display:'inline-block', transition:'all 0.2s' }} onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.35)'} onMouseLeave={e=>e.target.style.background='rgba(255,255,255,0.22)'}>{bn.cta} →</Link>
                </div>
              </div>
            ))}
            {/* Dots */}
            <div style={{ position:'absolute', bottom:14, right:20, display:'flex', gap:6 }}>
              {BANNERS.map((_,i)=>(
                <button key={i} onClick={()=>setSlide(i)} style={{ width: i===slide?24:8, height:8, borderRadius:100, background: i===slide?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.4)', border:'none', transition:'all 0.3s', cursor:'pointer' }} />
              ))}
            </div>
            {/* Arrows */}
            {['←','→'].map((arrow,i)=>(
              <button key={arrow} onClick={()=>setSlide(s=>(s+(i?1:-1)+BANNERS.length)%BANNERS.length)} style={{ position:'absolute', top:'50%', [i?'right':'left']:14, transform:'translateY(-50%)', width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', fontWeight:700, fontSize:16, cursor:'pointer', transition:'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.4)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}>{arrow}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES GRID ═══ */}
      <section style={{ padding:'60px 0 40px' }}>
        <div className="container">
          <div className="section-head reveal">
            <h2>Shop by Category</h2>
            <Link to="/products" style={{ color:'var(--primary)', fontWeight:600, fontSize:14 }}>View All →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:16 }}>
            {CATEGORIES.map((cat,i)=>(
              <Link key={cat.id} to={`/products?cat=${cat.id}`} className="reveal" style={{ animationDelay:`${i*0.05}s`, textDecoration:'none' }}>
                <div style={{ background:`linear-gradient(${cat.grad})`, borderRadius:20, padding:'20px 10px', textAlign:'center', cursor:'pointer', transition:'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease', boxShadow:'0 4px 15px rgba(0,0,0,0.10)' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px) scale(1.05)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.18)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 15px rgba(0,0,0,0.10)'}}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{cat.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#fff', letterSpacing:0.3 }}>{cat.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEAL OF THE DAY ═══ */}
      <section style={{ padding:'20px 0 60px' }}>
        <div className="container">
          <div className="section-head reveal">
            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <h2>🔥 Deal of the Day</h2>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:13, color:'var(--text2)' }}>Ends in:</span>
                {[['h',countdown.h],['m',countdown.m],['s',countdown.s]].map(([l,v])=>(
                  <div key={l} style={{ background:'linear-gradient(135deg,var(--primary),var(--accent))', color:'#fff', borderRadius:8, padding:'4px 10px', fontWeight:800, fontSize:16, fontFamily:'monospace', minWidth:42, textAlign:'center' }}>
                    {String(v).padStart(2,'0')}<div style={{ fontSize:9, fontWeight:500, opacity:0.8 }}>{l.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/products" style={{ color:'var(--primary)', fontWeight:600, fontSize:14 }}>All Deals →</Link>
          </div>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20 }}>
              {Array(4).fill(0).map((_,i)=><ProductCard key={i} skeleton />)}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20 }}>
              {DEALS.map((p,i)=>(
                <div key={p._id} className="reveal" style={{ transitionDelay:`${i*0.07}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ PROMO STRIP ═══ */}
      <section style={{ background:'linear-gradient(135deg,#1a1a2e,#16213e)', padding:'48px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:24 }}>
            {[['🚚','Free Delivery','On orders above ₹499'],['🔒','Secure Payments','100% safe & encrypted'],['↩️','Easy Returns','7-day hassle-free returns'],['⭐','Loyalty Rewards','Earn points on every order']].map(([icon,title,sub])=>(
              <div key={title} className="reveal" style={{ textAlign:'center', color:'#fff' }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
                <h4 style={{ fontWeight:700, marginBottom:4 }}>{title}</h4>
                <p style={{ fontSize:13, opacity:0.65 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section style={{ padding:'60px 0' }}>
        <div className="container">
          <div className="section-head reveal">
            <h2>⭐ Featured Products</h2>
            <Link to="/products?featured=true" style={{ color:'var(--primary)', fontWeight:600, fontSize:14 }}>View All →</Link>
          </div>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20 }}>
              {Array(8).fill(0).map((_,i)=><ProductCard key={i} skeleton />)}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20 }}>
              {FEATURED.map((p,i)=>(
                <div key={p._id} className="reveal" style={{ transitionDelay:`${i*0.06}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ SHOP BY CATEGORY — Detailed Cards ═══ */}
      {CATEGORIES.slice(0,4).map((cat,ci)=>{
        const catProducts = getByCat(cat.id).slice(0,4);
        return (
          <section key={cat.id} style={{ padding:'40px 0', background: ci%2===0?'var(--bg)':'var(--bg2)' }}>
            <div className="container">
              <div className="section-head reveal">
                <h2>{cat.icon} {cat.name}</h2>
                <Link to={`/products?cat=${cat.id}`} style={{ color:'var(--primary)', fontWeight:600, fontSize:14 }}>View All →</Link>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20 }}>
                {catProducts.map((p,i)=>(
                  <div key={p._id} className="reveal" style={{ transitionDelay:`${i*0.07}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ═══ NEWSLETTER / CTA ═══ */}
      <section style={{ padding:'64px 0', position:'relative', overflow:'hidden', background:'linear-gradient(135deg,var(--primary),var(--accent))' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div className="container" style={{ position:'relative', textAlign:'center' }}>
          <h2 className="reveal" style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#fff', marginBottom:12 }}>Never Miss a Deal! 🎁</h2>
          <p className="reveal" style={{ color:'rgba(255,255,255,0.85)', fontSize:16, marginBottom:32 }}>Join 50,000+ shoppers. Get exclusive offers & new arrivals.</p>
          <div className="reveal" style={{ display:'flex', justifyContent:'center', gap:0, maxWidth:440, margin:'0 auto' }}>
            <input placeholder="Enter your email address" style={{ flex:1, padding:'14px 22px', borderRadius:'100px 0 0 100px', border:'none', fontSize:15, fontFamily:'Outfit,sans-serif', outline:'none', background:'rgba(255,255,255,0.95)' }} />
            <button className="btn-primary" style={{ borderRadius:'0 100px 100px 0', padding:'14px 28px', background:'rgba(0,0,0,0.25)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)', fontSize:15, flexShrink:0 }}>Subscribe →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
