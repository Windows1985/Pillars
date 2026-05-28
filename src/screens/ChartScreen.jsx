import PillarChart from '../components/PillarChart.jsx';
import ElementBalance from '../components/ElementBalance.jsx';
import Interactions from '../components/Interactions.jsx';

function ScreenHead({ en, zh }) {
  return (
    <div style={{ padding: '56px 0 48px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
        Natal Chart · 八字命盘
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
        {en}
      </h2>
      <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 18, color: 'var(--text-muted)', marginTop: 6 }}>{zh}</div>
    </div>
  );
}

function SectionDivider({ en, zh }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '48px 0 24px' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{en}</span>
        <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 12, color: 'var(--text-muted)' }}>{zh}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

// Gray placeholder for components being redesigned in Step 4
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

export default function ChartScreen({ chart }) {
  const hasInteractions = (chart?.branchInteractions?.length ?? 0) > 0 || (chart?.stemCombinations?.length ?? 0) > 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px 80px' }}>
      <ScreenHead en="Four Pillars" zh="四柱" />

      {/* Four Pillars — existing component, Step 4 will redesign */}
      <Placeholder label="Four Pillars Chart" height={280} />

      <SectionDivider en="Element Balance" zh="五行" />
      <Placeholder label="Element Balance Viz" height={180} />

      {hasInteractions && (
        <>
          <SectionDivider en="Interactions" zh="干支关系" />
          <Placeholder label="Branch & Stem Interactions" height={160} />
        </>
      )}
    </div>
  );
}
