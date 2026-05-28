function Placeholder({ label, height = 200 }) {
  return (
    <div style={{
      height, background: 'var(--surface-1)',
      border: '1px solid var(--border)', borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label} · redesigned in Step 4
      </span>
    </div>
  );
}

export default function TimelineScreen({ chart }) {
  const { luckPillars, birthDate, currentYear } = chart;
  const age = currentYear - birthDate.year;
  const currentPillar = luckPillars?.pillars?.find(p => age >= p.startAge && age < p.endAge);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px 80px' }}>

      {/* Screen header */}
      <div style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Luck Pillars · 大运
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
          Your life arc
        </h2>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Current age</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)' }}>{age}</div>
          </div>
          {currentPillar && (
            <>
              <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Current decade</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--jade)' }}>Age {currentPillar.startAge}–{currentPillar.endAge}</div>
              </div>
            </>
          )}
          <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Direction</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)' }}>{luckPillars.forward ? 'Forward 顺' : 'Backward 逆'}</div>
          </div>
        </div>
      </div>

      {/* Horizontal timeline — Pudding.cool style, Step 4 */}
      <div style={{ marginTop: 48 }}>
        <Placeholder label="Horizontal scrubbable luck pillar timeline" height={280} />
      </div>

      {/* Decade detail panel */}
      <div style={{ marginTop: 24 }}>
        <Placeholder label="Decade detail panel (hover/click reveal)" height={160} />
      </div>
    </div>
  );
}
