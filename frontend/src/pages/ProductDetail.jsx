import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { PRODUCTS, getByCat } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(true);

  const p = PRODUCTS.find(x => x._id === id);
  const related = p ? getByCat(p.category).filter(x=>x._id!==id).slice(0,4) : [];

useEffect(() => {

  api.get(`/recommend/${productId}`)
    .then(res => setRecommended(res.data.recommended));

}, []);

  useEffect(()=>{ setLoading(true); setTimeout(()=>setLoading(false),400); },[id]);

  if (loading) return <div className="loader"><div className="spinner"/></div>;
  if (!p) return <div className="container" style={{padding:'60px 20px',textAlign:'center'}}><h2>Product not found</h2></div>;

  const discount = p.price&&p.discountPrice ? Math.round((p.price-p.discountPrice)/p.price*100) : 0;
  const price = p.discountPrice??p.price;

  const handleCart = () => {
    for(let i=0;i<qty;i++) dispatch(addToCart({_id:p._id,name:p.name,price:p.price,discountPrice:p.discountPrice,images:p.img?[{url:p.img}]:p.images,stock:p.stock}));
    toast.success(`Added to cart! 🛒`);
  };

  return (
    <div style={{padding:'32px 0 64px'}}>
      <div className="container">
        <div style={{fontSize:13,color:'var(--muted)',marginBottom:20,display:'flex',gap:8}}>
          <Link to="/" style={{color:'var(--primary)'}}>Home</Link>/
          <Link to="/products" style={{color:'var(--primary)'}}>Products</Link>/
          <Link to={`/products?cat=${p.category}`} style={{color:'var(--primary)'}}>{p.category}</Link>/
          <span>{p.name}</span>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'minmax(300px,1fr) 1fr',gap:48,marginBottom:64}}>
          {/* Image */}
          <div style={{borderRadius:24,overflow:'hidden',background:'var(--bg2)',height:420,position:'relative'}}>
            <img src={p.img||p.images?.[0]?.url||''} alt={p.name}
              style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s ease'}}
              onMouseEnter={e=>e.target.style.transform='scale(1.09)'}
              onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
            {discount>0&&<div style={{position:'absolute',top:16,left:16,background:'var(--primary)',color:'#fff',fontWeight:800,fontSize:14,padding:'6px 14px',borderRadius:100}}>-{discount}%</div>}
            <button onClick={()=>{setWished(w=>!w);toast(wished?'Removed':'❤️ Wishlisted!');}}
              style={{position:'absolute',top:16,right:16,width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.88)',backdropFilter:'blur(8px)',border:'none',fontSize:22,cursor:'pointer',transition:'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)'}}
              onMouseDown={e=>e.currentTarget.style.transform='scale(0.8)'}
              onMouseUp={e=>e.currentTarget.style.transform='scale(1.2)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
              {wished?'❤️':'🤍'}
            </button>
          </div>

          {/* Info */}
          <div>
            {p.brand&&<p style={{fontSize:12,fontWeight:800,color:'var(--primary)',letterSpacing:1.5,marginBottom:8}}>{p.brand.toUpperCase()}</p>}
            <h1 style={{fontSize:'clamp(20px,2.5vw,28px)',fontWeight:900,lineHeight:1.25,marginBottom:14,color:'var(--text)'}}>{p.name}</h1>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
              <div style={{display:'flex',gap:2}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:18,color:s<=Math.round(p.rating||0)?'#fbbf24':'var(--muted)'}}>★</span>)}</div>
              <span style={{fontWeight:700}}>{p.rating}</span>
              <span style={{color:'var(--muted)',fontSize:13}}>({(p.reviews||0).toLocaleString()} reviews)</span>
            </div>
            <div style={{display:'flex',alignItems:'baseline',gap:12,marginBottom:16,flexWrap:'wrap'}}>
              <span style={{fontSize:34,fontWeight:900,color:'var(--primary)'}}>₹{price.toLocaleString()}</span>
              {p.price&&p.discountPrice&&<>
                <span style={{fontSize:18,color:'var(--muted)',textDecoration:'line-through'}}>₹{p.price.toLocaleString()}</span>
                <span style={{background:'rgba(46,125,50,0.12)',color:'#2e7d32',padding:'4px 12px',borderRadius:100,fontSize:13,fontWeight:700}}>You save ₹{(p.price-p.discountPrice).toLocaleString()}</span>
              </>}
            </div>
            {p.desc&&<p style={{color:'var(--text2)',fontSize:15,lineHeight:1.75,marginBottom:20}}>{p.desc}</p>}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:22}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:p.stock>0?'#4caf50':'#e53935'}}/>
              <span style={{fontSize:14,fontWeight:700,color:p.stock>0?'#2e7d32':'var(--primary)'}}>{p.stock>0?(p.stock<10?`Only ${p.stock} left!`:'In Stock'):'Out of Stock'}</span>
            </div>
            {/* Qty */}
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
              <span style={{fontWeight:600,color:'var(--text2)',fontSize:14}}>Quantity:</span>
              <div style={{display:'flex',alignItems:'center',background:'var(--bg2)',borderRadius:100}}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:40,height:40,border:'none',background:'none',fontSize:22,cursor:'pointer',color:'var(--text)'}}>−</button>
                <span style={{minWidth:40,textAlign:'center',fontWeight:800,fontSize:16}}>{qty}</span>
                <button onClick={()=>setQty(q=>Math.min(p.stock||99,q+1))} style={{width:40,height:40,border:'none',background:'none',fontSize:22,cursor:'pointer',color:'var(--text)'}}>+</button>
              </div>
            </div>
            <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
              <button onClick={handleCart} disabled={!p.stock} className="btn-primary" style={{flex:1,padding:'14px',fontSize:15}}>🛒 Add to Cart</button>
              <Link to="/checkout" onClick={handleCart} className="btn-outline" style={{flex:1,padding:'14px',fontSize:15,textAlign:'center'}}>⚡ Buy Now</Link>
            </div>
            <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
              {[['🚚','Free Delivery ₹499+'],['↩️','7-day Returns'],['🔒','Secure Pay']].map(([ic,tx])=>(
                <div key={tx} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text2)'}}><span>{ic}</span><span>{tx}</span></div>
              ))}
            </div>
          </div>
        </div>

        {related.length>0&&(
          <div>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:20,color:'var(--text)'}}>🔗 Related Products</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:20}}>
              {related.map(rp=><ProductCard key={rp._id} product={rp}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
