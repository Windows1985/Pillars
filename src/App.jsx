import { useState } from 'react';
import InputForm from './components/InputForm.jsx';
import PillarChart from './components/PillarChart.jsx';
import ElementBalance from './components/ElementBalance.jsx';
import LuckPillars from './components/LuckPillars.jsx';
import Analysis from './components/Analysis.jsx';
import { calculateChart } from './bazi/calculate.js';
import { generateAnalysis } from './api/analysis.js';

export default function App() {
  // 'form' | 'exiting' | 'chart'
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

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0e', color: '#e8e4dd', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-baseline gap-3">
          <span className="font-serif text-xl tracking-wide" style={{ color: '#e8e4dd' }}>Pillars</span>
          <span className="text-[11px] tracking-widest uppercase" style={{ color: '#3a3733' }}>
            BaZi · Four Pillars of Destiny
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Form — centered, fades out on submit */}
        {(phase === 'form' || phase === 'exiting') && (
          <div
            className="max-w-lg mx-auto py-14 sm:py-20"
            style={{
              opacity: phase === 'exiting' ? 0 : 1,
              transition: 'opacity 0.32s ease',
              pointerEvents: phase === 'exiting' ? 'none' : 'auto',
            }}
          >
            <InputForm onSubmit={handleSubmit} />
          </div>
        )}

        {/* Chart — fades in after form exits */}
        {phase === 'chart' && chart && (
          <div
            className="pb-28 pt-10 space-y-8"
            style={{ animation: 'fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both' }}
          >
            <PillarChart chart={chart} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ElementBalance balance={chart.elementBalance} dayMaster={chart.dayMaster} />
              <LuckPillars
                luckPillars={chart.luckPillars}
                birthYear={chart.birthDate.year}
                currentYear={chart.currentYear}
              />
            </div>
            <Analysis text={analysis} loading={analysisLoading} error={analysisError} />
          </div>
        )}
      </main>
    </div>
  );
}
