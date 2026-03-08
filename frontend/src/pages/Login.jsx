import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back! 🎉');
      navigate(params.get('redirect') || '/');
    } else {
      toast.error(res.payload || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d1a1a 100%)' }}>
      {/* Animated blobs */}
      <div style={{ position:'absolute', top:'10%', left:'10%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(229,57,53,0.25),transparent 70%)', animation:'blob1 7s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'10%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(108,99,255,0.20),transparent 70%)', animation:'blob2 9s ease-in-out infinite' }} />
      <div style={{ position:'absolute', top:'50%', right:'20%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(67,233,123,0.15),transparent 70%)', animation:'blob1 5s ease-in-out infinite reverse' }} />
      <style>{`
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,15px) scale(1.1)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,-20px) scale(1.12)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Card */}
      <div style={{ width:'100%', maxWidth:420, background:'rgba(255,255,255,0.06)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:28, padding:'40px 36px', animation:'fadeIn 0.5s ease', position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>🛒</div>
          <h1 style={{ fontSize:26, fontWeight:800, background:'linear-gradient(135deg,#e53935,#ff6f00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>A to Z Cart</h1>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, marginTop:4 }}>Welcome back! Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:18 }}>
            <label style={ls}>📧 Email Address</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" required style={is} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={ls}>🔒 Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPwd?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Enter your password" required style={{ ...is, paddingRight:50 }} />
              <button type="button" onClick={()=>setShowPwd(s=>!s)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:18, cursor:'pointer' }}>{showPwd?'🙈':'👁️'}</button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign:'right', marginBottom:24 }}>
            <Link to="/forgot-password" style={{ fontSize:13, color:'rgba(229,57,53,0.9)', fontWeight:600 }}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', borderRadius:100, border:'none', background:'linear-gradient(135deg,#e53935,#ff6f00)', color:'#fff', fontWeight:800, fontSize:16, cursor: loading?'not-allowed':'pointer', opacity: loading?0.7:1, transition:'all 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}
            onMouseDown={e=>!loading&&(e.currentTarget.style.transform='scale(0.96)')}
            onMouseUp={e=>!loading&&(e.currentTarget.style.transform='scale(1)')}>
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
          <span style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>or</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Google Login Button */}
        <button style={{ width:'100%', padding:'13px', borderRadius:100, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.85)', fontWeight:600, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor:'pointer', transition:'all 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.13)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
          onClick={()=>toast('Google login coming soon!')}>
          <span style={{ fontSize:20 }}>🌐</span> Continue with Google
        </button>

        <p style={{ textAlign:'center', marginTop:24, color:'rgba(255,255,255,0.45)', fontSize:14 }}>
          Don't have an account?{' '}
          <Link to={`/register${params.get('ref')?`?ref=${params.get('ref')}`:''}`} style={{ color:'#ff7b6b', fontWeight:700 }}>Sign up free →</Link>
        </p>
      </div>
    </div>
  );
}

const ls = { display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'rgba(255,255,255,0.65)', letterSpacing:0.3 };
const is = { width:'100%', padding:'12px 18px', borderRadius:14, border:'1.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.9)', fontSize:15, fontFamily:'Outfit,sans-serif', outline:'none', transition:'border-color 0.2s', backdropFilter:'blur(10px)' };
