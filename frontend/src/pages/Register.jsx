import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';
import toast from 'react-hot-toast';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', referralCode: params.get('ref')||'' });
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match!'); return; }
    const res = await dispatch(register({ name: form.name, email: form.email, password: form.password, referralCode: form.referralCode }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Account created! Please verify your email 📧');
      navigate('/');
    } else {
      toast.error(res.payload || 'Registration failed');
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strColors = ['', '#e53935', '#ff9800', '#4caf50'];
  const strLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'linear-gradient(135deg,#0d0d1a,#1a0a2e,#0a1a0d)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'5%', right:'8%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(229,57,53,0.20),transparent 70%)', animation:'b1 7s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'5%', left:'5%', width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(67,233,123,0.15),transparent 70%)', animation:'b2 9s ease-in-out infinite' }} />
      <style>{`
        @keyframes b1{0%,100%{transform:translate(0,0)}50%{transform:translate(-15px,15px)}}
        @keyframes b2{0%,100%{transform:translate(0,0)}50%{transform:translate(12px,-18px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        input:focus{border-color:rgba(229,57,53,0.6)!important;box-shadow:0 0 0 3px rgba(229,57,53,0.12)!important}
      `}</style>

      <div style={{ width:'100%', maxWidth:440, background:'rgba(255,255,255,0.06)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:28, padding:'40px 36px', animation:'fadeIn 0.5s ease', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>🛒</div>
          <h1 style={{ fontSize:24, fontWeight:800, background:'linear-gradient(135deg,#e53935,#ff6f00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Create Account</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginTop:4 }}>Join 50,000+ smart shoppers</p>
          {form.referralCode && <div style={{ marginTop:10, background:'rgba(67,233,123,0.12)', border:'1px solid rgba(67,233,123,0.25)', borderRadius:100, padding:'6px 14px', display:'inline-block', fontSize:12, color:'rgba(67,233,123,0.9)', fontWeight:700 }}>🎁 Referral code applied! Get ₹50 credit</div>}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:16 }}>
            <label style={ls}>👤 Full Name</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your full name" required style={is} />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={ls}>📧 Email Address</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" required style={is} />
          </div>
          <div style={{ marginBottom:6 }}>
            <label style={ls}>🔒 Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPwd?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Create a password" required minLength={6} style={{ ...is, paddingRight:50 }} />
              <button type="button" onClick={()=>setShowPwd(s=>!s)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:18, cursor:'pointer' }}>{showPwd?'🙈':'👁️'}</button>
            </div>
          </div>
          {/* Strength bar */}
          {form.password && (
            <div style={{ display:'flex', gap:4, marginBottom:14 }}>
              {[1,2,3].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:100, background: i<=strength ? strColors[strength] : 'rgba(255,255,255,0.1)', transition:'background 0.3s' }} />)}
              <span style={{ fontSize:11, color: strColors[strength], fontWeight:700, marginLeft:4, alignSelf:'center' }}>{strLabels[strength]}</span>
            </div>
          )}
          <div style={{ marginBottom:16 }}>
            <label style={ls}>✅ Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} placeholder="Re-enter password" required style={{ ...is, borderColor: form.confirm && form.password!==form.confirm ? 'rgba(229,57,53,0.7)' : undefined }} />
            {form.confirm && form.password !== form.confirm && <p style={{ fontSize:12, color:'rgba(229,57,53,0.8)', marginTop:4 }}>⚠️ Passwords don't match</p>}
          </div>
          {!params.get('ref') && (
            <div style={{ marginBottom:24 }}>
              <label style={ls}>🎁 Referral Code (optional)</label>
              <input value={form.referralCode} onChange={e=>setForm(f=>({...f,referralCode:e.target.value}))} placeholder="Enter referral code for ₹50 bonus" style={is} />
            </div>
          )}

          <button type="submit" disabled={loading||form.password!==form.confirm} style={{ width:'100%', padding:'14px', borderRadius:100, border:'none', background:'linear-gradient(135deg,#e53935,#ff6f00)', color:'#fff', fontWeight:800, fontSize:16, cursor:'pointer', opacity: loading ? 0.7 : 1, transition:'all 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}
            onMouseDown={e=>e.currentTarget.style.transform='scale(0.96)'}
            onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}>
            {loading ? '⏳ Creating...' : '🚀 Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, color:'rgba(255,255,255,0.4)', fontSize:14 }}>
          Already have an account? <Link to="/login" style={{ color:'#ff7b6b', fontWeight:700 }}>Sign In →</Link>
        </p>
      </div>
    </div>
  );
}

const ls = { display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'rgba(255,255,255,0.65)' };
const is = { width:'100%', padding:'12px 18px', borderRadius:14, border:'1.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.9)', fontSize:15, fontFamily:'Outfit,sans-serif', outline:'none', transition:'all 0.2s', backdropFilter:'blur(10px)' };
