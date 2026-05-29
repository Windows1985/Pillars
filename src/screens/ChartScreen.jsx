import PillarChart from '../components/PillarChart.jsx';
import ElementBalance from '../components/ElementBalance.jsx';
import Interactions from '../components/Interactions.jsx';

function SectionDivider({ en, zh }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 32px' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{en}</span>
        <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 12, color: 'var(--text-muted)' }}>{zh}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

export default function ChartScreen({ chart }) {
  const hasInteractions = (chart?.branchInteractions?.length ?? 0) > 0 || (chart?.stemCombinations?.length ?? 0) > 0;

  return (
    <div className="screen-container" style={{ maxWidth: 1200, margin: '0 auto' }}>

      <div style={{ padding: '56px 0 48px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Natal Chart · 八字命盘
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
          Four Pillars
        </h2>
        <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 18, color: 'var(--text-muted)', marginTop: 6 }}>四柱</div>
      </div>

      <PillarChart chart={chart} />

      <SectionDivider en="Element Balance" zh="五行" />
      <ElementBalance balance={chart.elementBalance} dayMaster={chart.dayMaster} />

      {hasInteractions && (
        <>
          <SectionDivider en="Interactions" zh="干支关系" />
          <Interactions
            branchInteractions={chart.branchInteractions}
            stemCombinations={chart.stemCombinations}
          />
        </>
      )}
    </div>
  );
}
