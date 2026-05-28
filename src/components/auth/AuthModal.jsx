import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function AuthModal({ onClose, defaultMode = 'signin' }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else {
        await signUp(email, password, name);
        setSuccess('Check your email to confirm your account, then sign in.');
        setMode('signin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,7,9,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-[24px] p-8"
        style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="mb-7">
          <h2 className="text-lg font-medium mb-1" style={{ color: '#e8e4dd' }}>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h2>
          <p className="text-[13px]" style={{ color: '#4a4844' }}>
            {mode === 'signin' ? 'Access your saved charts.' : 'Save charts and unlock deeper analysis.'}
          </p>
        </div>

        {success && (
          <div className="mb-5 rounded-[12px] px-4 py-3 text-[13px]" style={{ background: 'rgba(196,145,58,0.08)', color: '#c4913a', border: '1px solid rgba(196,145,58,0.2)' }}>
            {success}
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-[12px] px-4 py-3 text-[13px]" style={{ background: 'rgba(217,107,84,0.06)', color: '#d96b54', border: '1px solid rgba(217,107,84,0.15)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] uppercase tracking-widest mb-2" style={{ color: '#3a3733' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-[12px] px-4 py-3 text-sm outline-none"
                style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.07)', color: '#e8e4dd' }}
              />
            </div>
          )}
          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2" style={{ color: '#3a3733' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-[12px] px-4 py-3 text-sm outline-none"
              style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.07)', color: '#e8e4dd' }}
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2" style={{ color: '#3a3733' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-[12px] px-4 py-3 text-sm outline-none"
              style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.07)', color: '#e8e4dd' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[12px] py-3 text-sm font-medium mt-2"
            style={{
              background: loading ? 'rgba(196,145,58,0.3)' : '#c4913a',
              color: loading ? '#9a7030' : '#070709',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            className="text-[12px]"
            style={{ color: '#4a4844', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
