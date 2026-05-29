import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Landing from './screens/Landing.jsx';
import Dashboard from './screens/Dashboard.jsx';
import ChartScreen from './screens/ChartScreen.jsx';
import AnalysisScreen from './screens/AnalysisScreen.jsx';
import TimelineScreen from './screens/TimelineScreen.jsx';
import InputForm from './components/InputForm.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import PricingPage from './components/subscription/PricingPage.jsx';
import { calculateChart } from './bazi/calculate.js';
import { saveChart, generateTeaser, generateNatal, loadUserCharts } from './api/serverAnalysis.js';
import { generateAnalysis } from './api/analysis.js';

export default function App() {
  const { user, tier, isPro, loading: authLoading, signOut, refreshProfile } = useAuth();

  const [screen, setScreen] = useState('landing');
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

  const [chartLoading, setChartLoading] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [showPricing, setShowPricing] = useState(false);

  // Handle post-upgrade redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === '1') {
      refreshProfile();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Load saved charts; if user has one, open it on dashboard
  useEffect(() => {
    if (!user) return;
    loadUserCharts().then(charts => {
      setSavedCharts(charts);
      if (charts.length > 0 && !chart) {
        openSavedChart(charts[0]);
      }
    }).catch(() => {});
  }, [user]);

  function resetAnalysis() {
    setTeaserText(''); setTeaserLoading(false); setTeaserError('');
    setNatalText(''); setNatalLoading(false); setNatalError('');
    setAnonAnalysis(''); setAnonLoading(false); setAnonError('');
    setChartId(null);
  }

  async function handleSubmit(formData) {
    const result = calculateChart(formData);
    setChart(result);
    resetAnalysis();
    setChartLoading(true);
    setTimeout(() => {
      setChartLoading(false);
      setScreen('dashboard');
      window.scrollTo(0, 0);
    }, 3000);

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
    setScreen('dashboard');

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

  if (authLoading) return null;

  const analysisProps = {
    chart, teaserText, teaserLoading, teaserError,
    natalText, natalLoading, natalError,
    anonAnalysis, anonLoading, anonError,
    tier, onUpgrade: handleUpgrade, user,
  };

  return (
    <>
      <AppShell
        screen={screen}
        onNavigate={setScreen}
        user={user}
        isPro={isPro}
        chart={chart}
        onSignOut={signOut}
        onSignIn={() => { setAuthMode('signin'); setShowAuth(true); }}
        onUpgrade={handleUpgrade}
      >
        {screen === 'landing' && (
          <Landing onEnter={() => setScreen('form')} />
        )}

        {screen === 'form' && !chartLoading && (
          <FormScreen
            onSubmit={handleSubmit}
            user={user}
            onSignUp={() => { setAuthMode('signup'); setShowAuth(true); }}
          />
        )}

        {chartLoading && <ChartLoadingScreen />}

        {screen === 'dashboard' && chart && (
          <Dashboard
            chart={chart}
            chartId={chartId}
            teaserText={teaserText}
            teaserLoading={teaserLoading}
            onNavigate={setScreen}
            savedCharts={savedCharts}
            onOpenSaved={openSavedChart}
            tier={tier}
            onUpgrade={handleUpgrade}
          />
        )}

        {screen === 'chart' && chart && (
          <ChartScreen chart={chart} />
        )}

        {screen === 'analysis' && chart && (
          <AnalysisScreen {...analysisProps} />
        )}

        {screen === 'timeline' && chart && (
          <TimelineScreen chart={chart} />
        )}
      </AppShell>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} />}
      {showPricing && <PricingPage onClose={() => setShowPricing(false)} currentTier={tier} />}
    </>
  );
}

function ChartLoadingScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100vh - 56px)', gap: 24,
    }}>
      <div style={{
        width: 36, height: 36,
        border: '1.5px solid var(--border)', borderTopColor: 'var(--jade)',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
      }}>
        Calculating your chart…
      </div>
    </div>
  );
}

// Thin wrapper around the existing InputForm
function FormScreen({ onSubmit, user, onSignUp }) {
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 32px 80px' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          New chart · 新建命盘
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.3 }}>
          Enter your birth data
        </h2>
      </div>
      <InputForm onSubmit={onSubmit} />
      {!user && (
        <p style={{ textAlign: 'center', marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          <button
            onClick={onSignUp}
            style={{ color: 'var(--jade)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            Create a free account
          </button>{' '}to save charts and unlock analysis.
        </p>
      )}
    </div>
  );
}
