import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartTotal, clearCart } from '../redux/cartSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Savings', 'Payment', 'Confirm'];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const subtotal = useSelector(selectCartTotal);
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [payMethod, setPayMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [savingsLoaded, setSavingsLoaded] = useState(false);

  const loadSavings = async () => {
    if (savingsLoaded) return;
    try {
      const [w, l] = await Promise.all([api.get('/wallet'), api.get('/loyalty')]);
      setWalletBalance(w.data.balance);
      setAvailablePoints(l.data.points);
      setSavingsLoaded(true);
    } catch {}
  };

  const applyCoupon = async () => {
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderTotal: subtotal });
      setCouponDiscount(data.discount); setCouponApplied(true);
      toast.success(`₹${data.discount} off applied!`);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
  };

  const applyLoyalty = async (use) => {
    if (!use) { setLoyaltyPoints(0); setLoyaltyDiscount(0); return; }
    const { data } = await api.get(`/loyalty/calculate?points=${availablePoints}&orderTotal=${subtotal}`);
    setLoyaltyPoints(data.pointsToUse); setLoyaltyDiscount(data.discount);
  };

  const shipping = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const totalSavings = couponDiscount + loyaltyDiscount + walletAmount;
  const total = Math.max(0, subtotal + shipping + tax - totalSavings);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post('/orders', {
        orderItems: items.map(i => ({ product: i._id, name: i.name, image: i.images?.[0]?.url || '', price: i.discountPrice || i.price, quantity: i.quantity })),
        shippingAddress: address, paymentMethod: payMethod,
        itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
        couponCode: couponApplied ? couponCode : undefined, couponDiscount,
        loyaltyPointsUsed: loyaltyPoints, walletAmountUsed: walletAmount,
      });
      dispatch(clearCart());
      toast.success('Order placed! 🎉');
      navigate('/orders');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setPlacing(false); }
  };

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: 700 }}>
      <h1 className="page-title">Checkout</h1>
      <div style={{ display: 'flex', marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i <= step ? '#e53935' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ marginLeft: 6, fontSize: 12, fontWeight: i === step ? 700 : 400, color: i <= step ? '#e53935' : '#9e9e9e' }}>{s}</span>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#e53935' : '#e0e0e0', margin: '0 8px' }} />}
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Shipping Address</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[{l:'Full Name',k:'fullName',col:2},{l:'Phone',k:'phone'},{l:'Street',k:'street',col:2},{l:'City',k:'city'},{l:'State',k:'state'},{l:'Pincode',k:'pincode'}].map(f => (
                <div key={f.k} style={f.col?{gridColumn:`span ${f.col}`}:{}}>
                  <label style={ls}>{f.l}</label>
                  <input value={address[f.k]} onChange={e => setAddress(a => ({...a,[f.k]:e.target.value}))} style={is} required />
                </div>
              ))}
            </div>
            <button onClick={() => { if(Object.values(address).every(v=>v)){setStep(1);loadSavings();}else toast.error('Fill all fields'); }} className="btn-primary" style={{marginTop:24}}>Continue →</button>
          </div>
        )}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Apply Savings</h2>
            <div style={{ marginBottom: 18, padding: 16, border: '1px solid #e0e0e0', borderRadius: 10 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 10 }}>🏷️ Coupon Code</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="SAVE10" style={{...is,flex:1}} disabled={couponApplied} />
                <button onClick={applyCoupon} disabled={couponApplied} className="btn-primary" style={{padding:'10px 20px'}}>{couponApplied?`✓ -₹${couponDiscount}`:'Apply'}</button>
              </div>
            </div>
            {walletBalance > 0 && (
              <div style={{ marginBottom: 18, padding: 16, border: '1px solid #e0e0e0', borderRadius: 10 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 8 }}>💰 Wallet: ₹{walletBalance}</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={walletAmount > 0} onChange={e => setWalletAmount(e.target.checked ? Math.min(walletBalance, subtotal) : 0)} />
                  Use ₹{Math.min(walletBalance, subtotal)} from wallet
                </label>
              </div>
            )}
            {availablePoints > 0 && (
              <div style={{ marginBottom: 18, padding: 16, border: '1px solid #e0e0e0', borderRadius: 10 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 8 }}>⭐ Points: {availablePoints}</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={loyaltyPoints > 0} onChange={e => applyLoyalty(e.target.checked)} />
                  Use {Math.min(availablePoints, Math.floor(subtotal * 0.2))} pts → ₹{loyaltyDiscount} off
                </label>
              </div>
            )}
            {totalSavings > 0 && <p style={{ color: '#2e7d32', fontWeight: 700 }}>You save ₹{totalSavings} 🎉</p>}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep(0)} className="btn-outline">← Back</button>
              <button onClick={() => setStep(2)} className="btn-primary">Continue →</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Payment</h2>
            {[{val:'cod',label:'💵 Cash on Delivery',desc:'Pay on delivery'},{val:'razorpay',label:'🇮🇳 Razorpay (UPI/Cards)',desc:'All Indian payments'},{val:'stripe',label:'💳 Stripe',desc:'International cards'}].map(pm => (
              <label key={pm.val} style={{ display:'flex',alignItems:'center',padding:'14px 18px',borderRadius:10,cursor:'pointer',marginBottom:10,border:payMethod===pm.val?'2px solid #e53935':'2px solid #e0e0e0',background:payMethod===pm.val?'#fff5f5':'#fff' }}>
                <input type="radio" value={pm.val} checked={payMethod===pm.val} onChange={e=>setPayMethod(e.target.value)} style={{marginRight:12}} />
                <div><div style={{fontWeight:700}}>{pm.label}</div><div style={{fontSize:12,color:'#9e9e9e'}}>{pm.desc}</div></div>
              </label>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary">Continue →</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Confirm Order</h2>
            {items.map(i => (
              <div key={i._id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <img src={i.images?.[0]?.url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                <span style={{ flex: 1, fontSize: 13 }}>{i.name} ×{i.quantity}</span>
                <span style={{ color: '#e53935', fontWeight: 700 }}>₹{((i.discountPrice||i.price)*i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e0e0e0', marginTop: 12, paddingTop: 12 }}>
              {[['Subtotal',`₹${subtotal.toLocaleString()}`],['Shipping',shipping===0?'FREE':`₹${shipping}`],['GST',`₹${tax.toLocaleString()}`],totalSavings>0&&['Savings',`-₹${totalSavings}`],['Total',`₹${total.toLocaleString()}`]].filter(Boolean).map(([k,v])=>(
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: k==='Total'?700:400, fontSize: k==='Total'?18:14, color: k==='Savings'?'#2e7d32':k==='Total'?'#e53935':'inherit' }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep(2)} className="btn-outline">← Back</button>
              <button onClick={placeOrder} disabled={placing} className="btn-primary" style={{ flex: 1, padding: 14, fontSize: 16 }}>
                {placing ? 'Placing...' : '🎉 Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const ls = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#424242' };
const is = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'Outfit, sans-serif', outline: 'none' };
