import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import api from '../utils/api';

let socket;

export default function LiveChat() {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef();

  useEffect(() => {
    if (!isAuthenticated) return;
    socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    socket.emit('join_user', user._id);

    socket.on('admin_reply', ({ text }) => {
      setMessages(m => [...m, { sender: 'admin', text, time: new Date() }]);
      if (!open) setUnread(u => u + 1);
    });

    api.get('/chat/my-chat').then(r => setMessages(r.data.chat?.messages || []));

    return () => socket?.disconnect();
  }, [isAuthenticated]);

  useEffect(() => {
    if (open) { setUnread(0); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }
  }, [open, messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = { sender: 'user', text, time: new Date() };
    setMessages(m => [...m, msg]);
    socket?.emit('user_message', { userId: user._id, text });
    await api.post('/chat/send', { text });
    setText('');
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999 }}>
      {open && (
        <div style={{ width: 320, height: 420, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
          {/* Header */}
          <div style={{ background: '#e53935', borderRadius: '16px 16px 0 0', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4caf50' }} />
              <span style={{ color: '#fff', fontWeight: 700 }}>Support Chat</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={18} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <p style={{ color: '#9e9e9e', fontSize: 13, textAlign: 'center', marginTop: 24 }}>👋 Hi! How can we help you today?</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: msg.sender === 'user' ? '#e53935' : '#f5f5f5',
                  color: msg.sender === 'user' ? '#fff' : '#212121',
                  borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  padding: '8px 12px', maxWidth: '75%', fontSize: 13,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} style={{ padding: '10px 12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none' }} />
            <button type="submit" style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><FiSend size={16} /></button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setOpen(!open)} style={{ width: 56, height: 56, borderRadius: '50%', background: '#e53935', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(229,57,53,0.4)', position: 'relative' }}>
        {open ? <FiX size={24} color="#fff" /> : <FiMessageSquare size={24} color="#fff" />}
        {unread > 0 && !open && (
          <span style={{ position: 'absolute', top: -2, right: -2, background: '#ff9800', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
        )}
      </button>
    </div>
  );
}
