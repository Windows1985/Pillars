import { useState } from 'react';
import InputForm from './components/InputForm.jsx';
import DayMaster from './components/DayMaster.jsx';
import PillarChart from './components/PillarChart.jsx';
import Interactions from './components/Interactions.jsx';
import ElementBalance from './components/ElementBalance.jsx';
import LuckPillars from './components/LuckPillars.jsx';
import Analysis from './components/Analysis.jsx';
import { calculateChart } from './bazi/calculate.js';
import { generateAnalysis } from './api/analysis.js';

function SectionHead({ en, zh }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="flex items-baseline gap-2.5">
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#4a4844' }}>{en}</span>
        <span className="text-sm cjk" style={{ color: '#2e2c2a' }}>{zh}</span>
      </div>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState('form');
  const [chart, setChart] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  async function handleSubmit(formData) {
    setPhase('exiting');
    const result = calculateChart(formData);
    await new Promise(r => setTimeout(r, 360));
    setChart(result);
    setAnalysis('');
    setAnalysisError('');
    setPhase('chart');
    setAnalysisLoading(true);
    generateAnalysis(result)
      .then(text => setAnalysis(text))
      .catch(e => setAnalysisError(e.message))
      .finally(() => setAnalysisLoading(false));
  }

  const hasInteractions =
    (chart?.branchInteractions?.length ?? 0) > 0 ||
    (chart?.stemCombinations?.length ?? 0) > 0;

  return (
    <div className="min-h-screen" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <header className="px-8 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto flex items-baseline gap-3">
          <span className="cjk text-xl tracking-wide" style={{ color: '#e8e4dd' }}>柱</span>
          <span className="text-xl tracking-wide" style={{ color: '#e8e4dd', fontWeight: 300, letterSpacing: '0.06em' }}>Pillars</span>
          <span className="text-[10px] tracking-[0.25em] uppercase ml-1" style={{ color: '#2e2c2a' }}>Four Pillars of Destiny</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-8">
        {(phase === 'form' || phase === 'exiting') && (
          <div
            className="max-w-lg mx-auto py-16 sm:py-24"
            style={{
              opacity: phase === 'exiting' ? 0 : 1,
              transition: 'opacity 0.32s ease',
              pointerEvents: phase === 'exiting' ? 'none' : 'auto',
            }}
          >
            <InputForm onSubmit={handleSubmit} />
          </div>
        )}

        {phase === 'chart' && chart && (
          <div
            className="py-12 pb-28 space-y-14"
            style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* 1 · Day Master */}
            <DayMaster dayMaster={chart.dayMaster} dayPillar={chart.pillars[2]} />

            {/* 2 · Four Pillars */}
            <section>
              <SectionHead en="Four Pillars" zh="四柱" />
              <PillarChart chart={chart} />
            </section>

            {/* 3 · Element Balance */}
            <section>
              <SectionHead en="Element Balance" zh="五行" />
              <ElementBalance balance={chart.elementBalance} dayMaster={chart.dayMaster} />
            </section>

            {/* 4 · Interactions */}
            {hasInteractions && (
              <section>
                <SectionHead en="Interactions" zh="干支关系" />
                <Interactions
                  branchInteractions={chart.branchInteractions}
                  stemCombinations={chart.stemCombinations}
                />
              </section>
            )}

            {/* 5 · Luck Pillars */}
            <section>
              <SectionHead en="Luck Pillars" zh="大运" />
              <LuckPillars
                luckPillars={chart.luckPillars}
                birthYear={chart.birthDate.year}
                currentYear={chart.currentYear}
              />
            </section>

            {/* 6 · Analysis */}
            <section>
              <SectionHead en="Analysis" zh="命理解析" />
              <Analysis text={analysis} loading={analysisLoading} error={analysisError} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
