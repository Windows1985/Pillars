export default function UpgradeNudge({ label, onUpgrade, compact = false }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: compact ? 10 : 14,
      padding: compact ? '8px 0' : '12px 0',
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: compact ? 12 : 13, fontWeight: 300,
        fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.5,
      }}>
        {label ?? 'Unlock AI analysis'}
      </span>
      <button
        onClick={onUpgrade}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
          textTransform: 'uppercase', padding: '6px 14px',
          background: 'rgba(196,145,58,0.1)', color: '#c4913a',
          border: '1px solid rgba(196,145,58,0.28)', borderRadius: 4,
          cursor: 'pointer', transition: 'background 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,145,58,0.18)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,145,58,0.1)'; }}
      >
        Upgrade to analyse →
      </button>
    </div>
  );
}
