import LuckPillars from '../components/LuckPillars.jsx';

export default function TimelineScreen({ chart, tier, onUpgrade, isPro }) {
  const { luckPillars, birthDate, currentYear } = chart;
  const age = currentYear - birthDate.year;
  const currentPillar = luckPillars?.pillars?.find(p => age >= p.startAge && age < p.endAge);

  return (
    <div className="screen-pad fade-in-up" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px 80px' }}>

      <div style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Luck Pillars · 大运
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
          Your life arc
        </h2>
        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 15,
          lineHeight: 1.65, color: 'var(--text-dim)', maxWidth: 560, marginTop: 14, marginBottom: 32,
        }}>
          Luck Pillars divide your life into roughly 10-year chapters. Each pillar brings a new pair of characters that interact with your natal chart, shifting the elemental forces available to you. The direction — forward or backward — is set by your sex and birth year.
        </p>
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)' }}>
              {luckPillars.forward
                ? 'Forward 顺 — pillars unfold in the natural stem cycle'
                : 'Backward 逆 — pillars unfold in reverse'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <LuckPillars
          luckPillars={luckPillars}
          birthYear={birthDate.year}
          currentYear={currentYear}
          chart={chart}
          isPro={isPro}
          onUpgrade={onUpgrade}
        />
      </div>
    </div>
  );
}
