import LuckPillars from '../components/LuckPillars.jsx';

export default function TimelineScreen({ chart }) {
  const { luckPillars, birthDate, currentYear } = chart;
  const age = currentYear - birthDate.year;
  const currentPillar = luckPillars?.pillars?.find(p => age >= p.startAge && age < p.endAge);

  return (
    <div className="screen-container" style={{ maxWidth: 1200, margin: '0 auto' }}>

      <div style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Luck Pillars · 大运
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
          Your life arc
        </h1>
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

      <div style={{ marginTop: 56 }}>
        <LuckPillars
          luckPillars={luckPillars}
          birthYear={birthDate.year}
          currentYear={currentYear}
        />
      </div>
    </div>
  );
}
