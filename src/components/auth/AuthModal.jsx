import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const INPUT_STYLE = {
  width: '100%', boxSizing: 'border-box',
  fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em',
  background: 'transparent',
  border: 'none', borderBottom: '1px solid var(--border)',
  padding: '10px 0', color: 'var(--text)',
  outline: 'none', caretColor: 'var(--jade)',
};

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
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(7,7,9,0.88)', backdropFilter: 'blur(8px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        padding: '40px 40px 36px',
      }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, fontStyle: 'italic',
            color: 'var(--text)', marginBottom: 6,
          }}>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h2>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {mode === 'signin' ? 'Access your saved charts.' : 'Save charts and unlock deeper analysis.'}
          </p>
        </div>

        {success && (
          <div style={{
            marginBottom: 24, padding: '12px 16px',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.6,
            background: 'rgba(196,145,58,0.06)', color: '#c4913a', border: '1px solid rgba(196,145,58,0.2)',
          }}>
            {success}
          </div>
        )}
        {error && (
          <div style={{
            marginBottom: 24, padding: '12px 16px',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.6,
            background: 'rgba(217,107,84,0.06)', color: '#d96b54', border: '1px solid rgba(217,107,84,0.15)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                Name
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={INPUT_STYLE} />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={INPUT_STYLE} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '13px 0', width: '100%',
              background: loading ? 'transparent' : 'var(--jade-bg)',
              color: loading ? 'var(--text-muted)' : 'var(--jade)',
              border: loading ? '1px solid var(--border)' : '1px solid var(--jade-border)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
              color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer',
            }}
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
