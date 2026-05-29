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
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 64px', height: 56,
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--surface-0)',
      }}>
        {/* Logo */}
        <button
          onClick={() => onNavigate(hasChart ? 'dashboard' : 'landing')}
          aria-label="Pillars — go to home"
          style={{ display: 'flex', alignItems: 'baseline', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 18, color: 'var(--text)' }}>柱</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 300, letterSpacing: '0.06em', color: 'var(--text)' }}>Pillars</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }} className="hidden sm:inline">
            Four Pillars of Destiny
          </span>
        </button>

        {/* Nav — only when chart exists */}
        {hasChart && (
          <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV.map(({ id, en }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                aria-current={screen === id ? 'page' : undefined}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13, fontWeight: 300, letterSpacing: '0.02em',
                  color: screen === id ? 'var(--text)' : 'var(--text-muted)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 14px', position: 'relative',
                }}
              >
                {en}
                {screen === id && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: 14, right: 14,
                    height: 1, background: 'var(--jade)',
                  }} />
                )}
              </button>
            ))}
          </nav>
        )}

        {/* User controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              {isPro && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--jade)', background: 'var(--jade-bg)', border: '1px solid var(--jade-border)', padding: '3px 8px', borderRadius: 2 }}>
                  Pro
                </span>
              )}
              {!isPro && (
                <button
                  onClick={onUpgrade}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: '#c4913a', background: 'rgba(196,145,58,0.08)', border: '1px solid rgba(196,145,58,0.2)', padding: '4px 10px', borderRadius: 3, cursor: 'pointer' }}
                >
                  Upgrade
                </button>
              )}
              <button
                onClick={onSignOut}
                aria-label="Sign out"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-dim)', background: 'var(--surface-1)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 4, cursor: 'pointer' }}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <main id="main-content">
        {children}
      </main>
    </div>
  );
}
