import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=reset
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Reset link sent to your email! Check inbox 📧');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally { setLoading(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match!'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully! 🎉');
      setTimeout(() => window.location.href = '/login', 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'linear-gradient(135deg,#0d0d1a,#1a0a2e)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'15%', left:'5%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(229,57,53,0.22),transparent 70%)', animation:'b1 7s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'8%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(108,99,255,0.18),transparent 70%)', animation:'b2 9s ease-in-out infinite' }} />
      <style>{`
        @keyframes b1{0%,100%{transform:translate(0,0)}50%{transform:translate(-15px,15px)}}
        @keyframes b2{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,-15px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        input:focus{border-color:rgba(229,57,53,0.6)!important;box-shadow:0 0 0 3px rgba(229,57,53,0.15)!important;}
      `}</style>

      <div style={{ width:'100%', maxWidth:420, background:'rgba(255,255,255,0.06)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:28, padding:'44px 38px', animation:'fadeIn 0.5s ease', position:'relative', zIndex:1 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,rgba(229,57,53,0.25),rgba(255,111,0,0.15))', backdropFilter:'blur(10px)', border:'1px solid rgba(229,57,53,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 16px' }}>
            {step===1 ? '🔑' : '🔒'}
          </div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', marginBottom:8 }}>
            {step===1 ? 'Forgot Password?' : 'Reset Password'}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, lineHeight:1.5 }}>
            {step===1 ? "No worries! Enter your email and we'll send you a reset link." : 'Enter the token from your email and set a new password.'}
          </p>
        </div>

        {/* Step 1: Email */}
        {step===1 && (
          <form onSubmit={sendEmail}>
            <label style={ls}>📧 Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your registered email" required style={is} />
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:6, marginBottom:24 }}>We'll send a password reset link to this email.</p>
            <button type="submit" disabled={loading} style={btn}
              onMouseDown={e=>e.currentTarget.style.transform='scale(0.96)'}
              onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}>
              {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
            </button>
            <button type="button" onClick={()=>setStep(2)} style={{ width:'100%', marginTop:10, padding:'12px', borderRadius:100, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.55)', fontSize:14, cursor:'pointer' }}>
              Already have a token? Enter it here →
            </button>
          </form>
        )}

        {/* Step 2: Token + New Password */}
        {step===2 && (
          <form onSubmit={resetPassword}>
            <div style={{ marginBottom:18 }}>
              <label style={ls}>🎫 Reset Token</label>
              <input type="text" value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste token from email" required style={is} />
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:6 }}>Copy the token from your email link (the part after /reset-password/)</p>
            </div>

            <div style={{ marginBottom:18 }}>
              <label style={ls}>🔒 New Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPwd?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter new password (min 6 chars)" required minLength={6} style={{ ...is, paddingRight:50 }} />
                <button type="button" onClick={()=>setShowPwd(s=>!s)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:18, cursor:'pointer' }}>{showPwd?'🙈':'👁️'}</button>
              </div>
            </div>

            <div style={{ marginBottom:28 }}>
              <label style={ls}>✅ Confirm New Password</label>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter new password" required style={{ ...is, borderColor: confirm && password !== confirm ? 'rgba(229,57,53,0.7)' : undefined }} />
              {confirm && password !== confirm && <p style={{ fontSize:12, color:'rgba(229,57,53,0.9)', marginTop:6 }}>⚠️ Passwords do not match</p>}
            </div>

            <button type="submit" disabled={loading || (confirm && password !== confirm)} style={{ ...btn, opacity: (loading || (confirm && password !== confirm)) ? 0.6 : 1 }}
              onMouseDown={e=>e.currentTarget.style.transform='scale(0.96)'}
              onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}>
              {loading ? '⏳ Resetting...' : '🔓 Reset Password'}
            </button>
            <button type="button" onClick={()=>setStep(1)} style={{ width:'100%', marginTop:10, padding:'12px', borderRadius:100, border:'none', background:'transparent', color:'rgba(255,255,255,0.45)', fontSize:14, cursor:'pointer' }}>
              ← Send email again
            </button>
          </form>
        )}

        <p style={{ textAlign:'center', marginTop:24, color:'rgba(255,255,255,0.4)', fontSize:14 }}>
          Remember it? <Link to="/login" style={{ color:'#ff7b6b', fontWeight:700 }}>Sign In →</Link>
        </p>
      </div>
    </div>
  );
}

const ls = { display:'block', fontSize:13, fontWeight:600, marginBottom:8, color:'rgba(255,255,255,0.65)' };
const is = { width:'100%', padding:'13px 18px', borderRadius:14, border:'1.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.9)', fontSize:15, fontFamily:'Outfit,sans-serif', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', backdropFilter:'blur(10px)' };
const btn = { width:'100%', padding:'14px', borderRadius:100, border:'none', background:'linear-gradient(135deg,#e53935,#ff6f00)', color:'#fff', fontWeight:800, fontSize:16, cursor:'pointer', transition:'all 0.18s cubic-bezier(0.34,1.56,0.64,1)' };
