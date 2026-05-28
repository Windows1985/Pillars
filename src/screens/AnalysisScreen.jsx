import Analysis from '../components/Analysis.jsx';
import BlurGate from '../components/paywall/BlurGate.jsx';

function SectionDivider({ en, zh, chapter }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 28px' }}>
      {chapter && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {chapter}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{en}</span>
        <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 12, color: 'var(--text-muted)' }}>{zh}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

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

export default function AnalysisScreen({
  chart, teaserText, teaserLoading, teaserError,
  natalText, natalLoading, natalError,
  tier, onUpgrade, anonAnalysis, anonLoading, anonError,
  user,
}) {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 64px 80px' }}>

      {/* Screen header */}
      <div style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Analysis · 命理解析
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
          Your natal reading
        </h2>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 300, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.7 }}>
          A full-text interpretation of your chart's structure, element dynamics, and decade-level timing.
        </p>
      </div>

      {/* Teaser / intro section */}
      <SectionDivider en="Overview" zh="概述" chapter="I" />
      <Placeholder label="Teaser analysis" height={160} />

      {/* Natal analysis — Pro-gated */}
      <SectionDivider en="Full Natal Reading" zh="完整命理" chapter="II" />
      <Placeholder label="Full natal analysis (Pro, blur-gated)" height={320} />

      <SectionDivider en="Personality" zh="性格" chapter="III" />
      <Placeholder label="Personality chapter (Pro)" height={240} />

      <SectionDivider en="Career" zh="事业" chapter="IV" />
      <Placeholder label="Career chapter (Pro)" height={240} />

      <SectionDivider en="Relationships" zh="感情" chapter="V" />
      <Placeholder label="Relationships chapter (Pro)" height={240} />
    </div>
  );
}
