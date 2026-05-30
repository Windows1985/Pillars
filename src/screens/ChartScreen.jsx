import { useState, useEffect } from 'react';
import PillarChart from '../components/PillarChart.jsx';
import ElementBalance from '../components/ElementBalance.jsx';
import Interactions from '../components/Interactions.jsx';
import UpgradeNudge from '../components/paywall/UpgradeNudge.jsx';
import { generateElementBalanceReading, generateInteractionsReading } from '../api/proAnalysis.js';

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

function Spinner() {
  return (
    <div style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--border)', borderTopColor: 'var(--jade)', animation: 'spin 0.9s linear infinite', verticalAlign: 'middle', marginRight: 8 }} />
  );
}

function AiReading({ text, loading, error }) {
  if (loading) return <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: 24 }}><Spinner />Reading your chart…</p>;
  if (error) return <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#d96b54', marginTop: 24 }}>{error}</p>;
  if (!text) return null;
  return (
    <p style={{
      fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 300, lineHeight: 1.8,
      color: 'var(--text-dim)', maxWidth: 680, marginTop: 28, textWrap: 'pretty',
    }}>
      {text}
    </p>
  );
}

export default function ChartScreen({ chart, tier, onUpgrade, isPro }) {
  const hasInteractions = (chart?.branchInteractions?.length ?? 0) > 0 || (chart?.stemCombinations?.length ?? 0) > 0;

  const [balanceText, setBalanceText] = useState('');
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState('');

  const [interactText, setInteractText] = useState('');
  const [interactLoading, setInteractLoading] = useState(false);
  const [interactError, setInteractError] = useState('');

  useEffect(() => {
    if (!isPro) return;
    setBalanceLoading(true);
    generateElementBalanceReading(chart)
      .then(t => setBalanceText(t))
      .catch(e => setBalanceError(e.message))
      .finally(() => setBalanceLoading(false));

    if (hasInteractions) {
      setInteractLoading(true);
      generateInteractionsReading(chart)
        .then(t => setInteractText(t))
        .catch(e => setInteractError(e.message))
        .finally(() => setInteractLoading(false));
    }
  }, [isPro]);

  return (
    <div className="screen-container fade-in-up" style={{ maxWidth: 1200, margin: '0 auto' }}>

      <div style={{ padding: '56px 0 48px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Natal Chart · 八字命盘
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
          Four Pillars
        </h2>
        <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 18, color: 'var(--text-muted)', marginTop: 6 }}>四柱</div>
        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic',
          fontSize: 16, color: 'var(--text-dim)', maxWidth: 560, marginTop: 14, lineHeight: 1.6,
        }}>
          Four pairs of characters — year, month, day, and hour of birth. The top character of each pair is the Heavenly Stem (天干); the bottom is the Earthly Branch (地支).
        </p>
      </div>

      <PillarChart chart={chart} tier={tier} onUpgrade={onUpgrade} isPro={isPro} />

      <SectionDivider en="Element Balance" zh="五行" />
      <ElementBalance balance={chart.elementBalance} dayMaster={chart.dayMaster} />
      <AiReading text={balanceText} loading={balanceLoading} error={balanceError} />
      {!isPro && <UpgradeNudge label="Get an AI reading of your element balance" onUpgrade={onUpgrade} />}

      {hasInteractions && (
        <>
          <SectionDivider en="Interactions" zh="干支关系" />
          <Interactions
            branchInteractions={chart.branchInteractions}
            stemCombinations={chart.stemCombinations}
          />
          <AiReading text={interactText} loading={interactLoading} error={interactError} />
          {!isPro && <UpgradeNudge label="Analyse your chart's interactions" onUpgrade={onUpgrade} />}
        </>
      )}
    </div>
  );
}
