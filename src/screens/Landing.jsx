export default function Landing({ onEnter }) {
  return (
    <div className="fade-in-up" style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(32px, 8vw, 64px)', textAlign: 'center',
    }}>
      <div className="glow-cjk" style={{
        fontFamily: 'var(--font-cjk)',
        fontSize: 'clamp(80px, 14vw, 128px)', lineHeight: 0.9,
        color: 'var(--text)',
        marginBottom: 32,
      }}>
        柱
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 38, fontWeight: 300, fontStyle: 'italic',
        color: 'var(--text)', marginBottom: 20, letterSpacing: '-0.01em',
      }}>
        Pillars
      </h1>

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18, fontWeight: 300, lineHeight: 1.65,
        color: 'var(--text-dim)', marginBottom: 16,
        maxWidth: 460, textWrap: 'pretty',
      }}>
        A serious analysis of your BaZi chart. Personality, career,
        relationships, and timing — from the Four Pillars of Destiny.
      </p>

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 15, fontWeight: 300, lineHeight: 1.65,
        color: 'var(--text-dim)', marginBottom: 52,
        maxWidth: 460, textWrap: 'pretty',
      }}>
        BaZi is a 1,200-year-old Chinese system that reads your personality, timing, and life themes from your exact birth date and time.
      </p>

      <button
        onClick={onEnter}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--jade)', background: 'var(--jade-bg)',
          border: '1px solid var(--jade-border)',
          padding: '12px 32px', borderRadius: 4, cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'oklch(17% 0.05 162)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--jade-border)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--jade-bg)'; e.currentTarget.style.boxShadow = 'none'; }}
        onMouseDown={e => { e.currentTarget.style.opacity = '0.75'; }}
        onMouseUp={e => { e.currentTarget.style.opacity = '1'; }}
      >
        Enter birth data →
      </button>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginTop: 24,
      }}>
        四柱命理 · Four Pillars of Destiny
      </p>
    </div>
  );
}
