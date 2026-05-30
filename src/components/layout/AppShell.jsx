const NAV = [
  { id: 'dashboard', en: 'Dashboard', zh: '首页' },
  { id: 'chart',     en: 'Chart',     zh: '四柱' },
  { id: 'analysis',  en: 'Analysis',  zh: '解析' },
  { id: 'timeline',  en: 'Timeline',  zh: '大运' },
];

export default function AppShell({
  screen, onNavigate, user, isPro, chart,
  onSignOut, onSignIn, onUpgrade, children,
}) {
  const hasChart = !!chart;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)' }}>
      <header
        className="shell-header"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 64px', height: 56,
          borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--surface-0)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavigate(hasChart ? 'dashboard' : 'landing')}
          style={{ display: 'flex', alignItems: 'baseline', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
          onMouseDown={e => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseUp={e => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 18, color: 'var(--text)' }}>柱</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 300, letterSpacing: '0.06em', color: 'var(--text)' }}>Pillars</span>
          <span className="nav-label-long" style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Four Pillars of Destiny
          </span>
        </button>

        {/* Nav — only when chart exists */}
        {hasChart && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV.map(({ id, en, zh }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13, fontWeight: 300, letterSpacing: '0.02em',
                  color: screen === id ? 'var(--text)' : 'var(--text-muted)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 10px', position: 'relative',
                  borderRadius: 4,
                }}
                onMouseEnter={e => { if (screen !== id) e.currentTarget.style.color = 'var(--text-dim)'; }}
                onMouseLeave={e => { if (screen !== id) e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'none'; }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {/* Show CJK on mobile, English on desktop */}
                <span className="nav-label-long">{en}</span>
                <span className="nav-label-short" style={{ display: 'none' }}>{zh}</span>
                {screen === id && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: 10, right: 10,
                    height: 1, background: 'var(--jade)',
                    borderRadius: 1,
                  }} />
                )}
              </button>
            ))}
          </nav>
        )}

        {/* User controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              {isPro && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--jade)', background: 'var(--jade-bg)', border: '1px solid var(--jade-border)', padding: '3px 8px', borderRadius: 4 }}>
                  Pro
                </span>
              )}
              {!isPro && (
                <button
                  onClick={onUpgrade}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: '#c4913a', background: 'rgba(196,145,58,0.08)', border: '1px solid rgba(196,145,58,0.2)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,145,58,0.16)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,145,58,0.08)'; e.currentTarget.style.transform = 'none'; }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                  onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  Upgrade
                </button>
              )}
              <button
                onClick={onSignOut}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'none'; }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-dim)', background: 'var(--surface-1)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 4, cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      {children}
    </div>
  );
}
