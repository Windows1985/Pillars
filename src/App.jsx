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
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4">
        <h1 className="font-serif text-2xl tracking-wide text-neutral-100">Pillars</h1>
        <p className="text-xs text-neutral-500 mt-0.5">BaZi — Four Pillars of Destiny</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <InputForm onSubmit={handleSubmit} />

        {chart && (
          <>
            <PillarChart chart={chart} stemCombinations={chart.stemCombinations} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ElementBalance balance={chart.elementBalance} dayMaster={chart.dayMaster} />
              <LuckPillars luckPillars={chart.luckPillars} birthYear={chart.birthDate.year} currentYear={chart.currentYear} />
            </div>
            <Analysis text={analysis} loading={analysisLoading} error={analysisError} />
          </>
        )}
      </main>
    </div>
  );
}
