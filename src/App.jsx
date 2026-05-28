import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext.jsx';
import InputForm from './components/InputForm.jsx';
import DayMaster from './components/DayMaster.jsx';
import PillarChart from './components/PillarChart.jsx';
import Interactions from './components/Interactions.jsx';
import ElementBalance from './components/ElementBalance.jsx';
import LuckPillars from './components/LuckPillars.jsx';
import Analysis from './components/Analysis.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import PricingPage from './components/subscription/PricingPage.jsx';
import MonthlyForecast from './components/features/MonthlyForecast.jsx';
import AskPillars from './components/features/AskPillars.jsx';
import DecisionReport from './components/features/DecisionReport.jsx';
import { calculateChart } from './bazi/calculate.js';
import { generateAnalysis } from './api/analysis.js';
import { saveChart, generateTeaser, generateNatal, loadUserCharts } from './api/serverAnalysis.js';

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

function ChartCard({ chart: saved, onOpen }) {
  const dm = saved.chart_data?.dayMaster?.stem;
  const colors = { Wood: '#5a8f5a', Fire: '#c4613a', Earth: '#c4913a', Metal: '#a8a8a0', Water: '#5592b8' };
  const hex = dm ? (colors[dm.element] ?? '#5a5754') : '#5a5754';

  return (
    <button
      onClick={() => onOpen(saved)}
      className="card-hover rounded-[18px] p-4 text-left w-full"
      style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
    >
      <div className="flex items-center gap-3 mb-2">
        {dm && <span className="cjk text-xl" style={{ color: hex }}>{dm.char}</span>}
        <span className="text-sm font-medium" style={{ color: '#e8e4dd' }}>{saved.name}</span>
      </div>
      <div className="text-[11px]" style={{ color: '#3a3733' }}>
        {new Date(saved.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </button>
  );
}

export default function App() {
  const { user, tier, isPro, loading: authLoading, signOut, refreshProfile } = useAuth();

  const [phase, setPhase] = useState('form');
  const [chart, setChart] = useState(null);
  const [chartId, setChartId] = useState(null);
  const [savedCharts, setSavedCharts] = useState([]);

  const [teaserText, setTeaserText] = useState('');
  const [teaserLoading, setTeaserLoading] = useState(false);
  const [teaserError, setTeaserError] = useState('');
  const [natalText, setNatalText] = useState('');
  const [natalLoading, setNatalLoading] = useState(false);
  const [natalError, setNatalError] = useState('');

  const [anonAnalysis, setAnonAnalysis] = useState('');
  const [anonLoading, setAnonLoading] = useState(false);
  const [anonError, setAnonError] = useState('');

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === '1') {
      refreshProfile();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (user) loadUserCharts().then(setSavedCharts).catch(() => {});
  }, [user]);

  function resetAnalysis() {
    setTeaserText(''); setTeaserLoading(false); setTeaserError('');
    setNatalText(''); setNatalLoading(false); setNatalError('');
    setAnonAnalysis(''); setAnonLoading(false); setAnonError('');
    setChartId(null);
  }

  async function handleSubmit(formData) {
    setPhase('exiting');
    const result = calculateChart(formData);
    await new Promise(r => setTimeout(r, 360));
    setChart(result);
    resetAnalysis();
    setPhase('chart');

    if (user) {
      try {
        const name = formData.name?.trim() || `Chart ${new Date().toLocaleDateString('en-GB')}`;
        const id = await saveChart(result, name);
        setChartId(id);
        loadUserCharts().then(setSavedCharts).catch(() => {});

        setTeaserLoading(true);
        generateTeaser(id)
          .then(t => setTeaserText(t))
          .catch(e => setTeaserError(e.message))
          .finally(() => setTeaserLoading(false));

        if (isPro) {
          setNatalLoading(true);
          generateNatal(id)
            .then(t => setNatalText(t))
            .catch(e => setNatalError(e.message))
            .finally(() => setNatalLoading(false));
        }
      } catch (e) {
        setTeaserError(e.message);
      }
    } else {
      setAnonLoading(true);
      generateAnalysis(result)
        .then(t => setAnonAnalysis(t))
        .catch(e => setAnonError(e.message))
        .finally(() => setAnonLoading(false));
    }
  }

  function openSavedChart(saved) {
    setChart(saved.chart_data);
    setChartId(saved.id);
    resetAnalysis();
    setPhase('chart');

    setTeaserLoading(true);
    generateTeaser(saved.id)
      .then(t => setTeaserText(t))
      .catch(e => setTeaserError(e.message))
      .finally(() => setTeaserLoading(false));

    if (isPro) {
      setNatalLoading(true);
      generateNatal(saved.id)
        .then(t => setNatalText(t))
        .catch(e => setNatalError(e.message))
        .finally(() => setNatalLoading(false));
    }
  }

  function handleUpgrade() {
    if (!user) { setAuthMode('signup'); setShowAuth(true); }
    else setShowPricing(true);
  }

  const hasInteractions = (chart?.branchInteractions?.length ?? 0) > 0 || (chart?.stemCombinations?.length ?? 0) > 0;

  if (authLoading) return null;

  return (
    <div className="min-h-screen" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      {/* Header */}
      <header className="px-8 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => { setPhase('form'); setChart(null); resetAnalysis(); }}
            className="flex items-baseline gap-3"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span className="cjk text-xl tracking-wide" style={{ color: '#e8e4dd' }}>柱</span>
            <span className="text-xl tracking-wide" style={{ color: '#e8e4dd', fontWeight: 300, letterSpacing: '0.06em' }}>Pillars</span>
            <span className="text-[10px] tracking-[0.25em] uppercase ml-1 hidden sm:inline" style={{ color: '#2e2c2a' }}>Four Pillars of Destiny</span>
          </button>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {!isPro && (
                  <button
                    onClick={() => setShowPricing(true)}
                    className="text-[11px] px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(196,145,58,0.1)', color: '#c4913a', border: '1px solid rgba(196,145,58,0.2)', cursor: 'pointer' }}
                  >
                    Upgrade
                  </button>
                )}
                <button
                  onClick={signOut}
                  className="text-[11px]"
                  style={{ color: '#3a3733', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setAuthMode('signin'); setShowAuth(true); }}
                className="text-[12px] px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#7a7672', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-8">
        {/* ── Form ── */}
        {(phase === 'form' || phase === 'exiting') && (
          <div
            style={{
              opacity: phase === 'exiting' ? 0 : 1,
              transition: 'opacity 0.32s ease',
              pointerEvents: phase === 'exiting' ? 'none' : 'auto',
            }}
          >
            {user && savedCharts.length > 0 && (
              <div className="pt-10 pb-8">
                <div className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#3a3733' }}>Saved charts</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {savedCharts.map(c => <ChartCard key={c.id} chart={c} onOpen={openSavedChart} />)}
                </div>
                <div className="h-px mb-10" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            )}

            <div className="max-w-lg mx-auto py-12 sm:py-16">
              <InputForm onSubmit={handleSubmit} />
              {!user && (
                <p className="text-center mt-6 text-[12px]" style={{ color: '#3a3733' }}>
                  <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }} style={{ color: '#c4913a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Create a free account
                  </button>{' '}to save charts and unlock analysis.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Chart ── */}
        {phase === 'chart' && chart && (
          <div
            className="py-12 pb-28 space-y-14"
            style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            <DayMaster dayMaster={chart.dayMaster} dayPillar={chart.pillars[2]} />

            <section>
              <SectionHead en="Four Pillars" zh="四柱" />
              <PillarChart chart={chart} />
            </section>

            <section>
              <SectionHead en="Element Balance" zh="五行" />
              <ElementBalance balance={chart.elementBalance} dayMaster={chart.dayMaster} />
            </section>

            {hasInteractions && (
              <section>
                <SectionHead en="Interactions" zh="干支关系" />
                <Interactions branchInteractions={chart.branchInteractions} stemCombinations={chart.stemCombinations} />
              </section>
            )}

            <section>
              <SectionHead en="Luck Pillars" zh="大运" />
              <LuckPillars luckPillars={chart.luckPillars} birthYear={chart.birthDate.year} currentYear={chart.currentYear} />
            </section>

            {user && chartId && (
              <section>
                <SectionHead en="Monthly Forecast" zh="月运" />
                <MonthlyForecast chartId={chartId} tier={tier} onUpgrade={handleUpgrade} />
              </section>
            )}

            <section>
              <SectionHead en="Analysis" zh="命理解析" />
              {user ? (
                <Analysis
                  teaserText={teaserText} teaserLoading={teaserLoading} teaserError={teaserError}
                  natalText={natalText} natalLoading={natalLoading} natalError={natalError}
                  tier={tier} onUpgrade={handleUpgrade}
                />
              ) : (
                <div className="card-hover rounded-[22px] p-7" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {anonLoading && (
                    <div className="flex flex-col items-center gap-4 py-6">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#c4913a', animation: 'spin 0.9s linear infinite' }} />
                      <p className="text-[13px]" style={{ color: '#4a4844' }}>AI is analysing your chart…</p>
                    </div>
                  )}
                  {anonError && <p className="text-[13px]" style={{ color: '#d96b54' }}>{anonError}</p>}
                  {anonAnalysis && (
                    <div className="space-y-5">
                      {anonAnalysis.split('\n\n').filter(p => p.trim()).map((para, i) => (
                        <p key={i} className="leading-[1.8]" style={{ fontSize: 15, color: i === 0 ? '#e8e4dd' : '#7a7672' }}>{para.trim()}</p>
                      ))}
                      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <p className="text-[12px] mb-3" style={{ color: '#4a4844' }}>
                          <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }} style={{ color: '#c4913a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                            Create a free account
                          </button>{' '}to save this chart and unlock the full natal analysis.
                        </p>
                        <p className="text-[11px]" style={{ color: '#2e2c2a' }}>BaZi describes patterns and tendencies — not certainties.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {user && chartId && (
              <section>
                <SectionHead en="Ask Pillars" zh="问命" />
                <AskPillars chartId={chartId} tier={tier} onUpgrade={handleUpgrade} />
              </section>
            )}

            {user && chartId && (
              <section>
                <SectionHead en="Decision Reports" zh="决策" />
                <DecisionReport chartId={chartId} tier={tier} onUpgrade={handleUpgrade} />
              </section>
            )}
          </div>
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} />}
      {showPricing && <PricingPage onClose={() => setShowPricing(false)} currentTier={tier} />}
    </div>
  );
}
