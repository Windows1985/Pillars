import { useState } from 'react';
import InputForm from './components/InputForm.jsx';
import PillarChart from './components/PillarChart.jsx';
import ElementBalance from './components/ElementBalance.jsx';
import LuckPillars from './components/LuckPillars.jsx';
import Analysis from './components/Analysis.jsx';
import { calculateChart } from './bazi/calculate.js';
import { generateAnalysis } from './api/analysis.js';

export default function App() {
  const [chart, setChart] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  async function handleSubmit(formData) {
    const result = calculateChart(formData);
    setChart(result);
    setAnalysis('');
    setAnalysisError('');
    setAnalysisLoading(true);
    try {
      const text = await generateAnalysis(result);
      setAnalysis(text);
    } catch (e) {
      setAnalysisError(e.message);
    } finally {
      setAnalysisLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#ece8e1]">
      {/* Header */}
      <header className="border-b border-white/[0.05] px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-baseline gap-4">
          <span className="font-serif text-xl tracking-wide text-[#ece8e1]">Pillars</span>
          <span className="text-[11px] text-[#3d3a37] tracking-widest uppercase">BaZi · Four Pillars of Destiny</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Form — centered narrow column */}
        <div className="max-w-xl mx-auto py-12 sm:py-16">
          <InputForm onSubmit={handleSubmit} />
        </div>

        {/* Chart output — fades in when ready */}
        {chart && (
          <div
            className="pb-24 space-y-8"
            style={{ animation: 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="border-t border-white/[0.05]" />
            <PillarChart chart={chart} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
