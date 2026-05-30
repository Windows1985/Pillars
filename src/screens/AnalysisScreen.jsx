import { useEffect, useState } from 'react';
import BlurGate from '../components/paywall/BlurGate.jsx';
import { generatePersonalityReading, generateCareerReading, generateRelationshipsReading } from '../api/proAnalysis.js';

function SectionDivider({ en, zh, chapter }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 28px' }}>
      {chapter && (
        <span
          title={`Section ${chapter}`}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
        >
          {chapter}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{en}</span>
        <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 10, color: 'var(--text-muted)' }}>{zh}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '12px 0' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>
        Generating analysis…
      </p>
      {[100, 90, 95, 78, 88, 65, 92, 55, 82].map((w, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: `${w}%`, height: 16, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--border)', borderTopColor: 'var(--jade)', animation: 'spin 0.9s linear infinite', verticalAlign: 'middle', marginRight: 6 }} />
  );
}

function Prose({ text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: '72ch' }}>
      {text.split('\n\n').filter(p => p.trim()).map((para, i) => (
        <p key={i} style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 300,
          lineHeight: 1.85, color: i === 0 ? 'var(--text)' : 'var(--text-dim)',
          textWrap: 'pretty',
        }}>
          {para.trim()}
        </p>
      ))}
    </div>
  );
}

function NatalBlurGate({ onUpgrade }) {
  return (
    <BlurGate required="pro" current="free" label="Full natal analysis: personality, career, relationships, and timing" onUpgrade={onUpgrade}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0' }}>
        {[88, 65, 92, 48, 78, 56, 84, 40, 72, 60, 82, 50].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 7, background: 'var(--border)', borderRadius: 2 }} />
        ))}
      </div>
    </BlurGate>
  );
}

export default function AnalysisScreen({
  chart, teaserText, teaserLoading, teaserError,
  natalText, natalLoading, natalError,
  tier, onUpgrade, anonAnalysis, anonLoading, anonError,
  user, onRetryTeaser, onRetryNatal, onRetryAnon,
}) {
  const isPro = tier === 'pro' || tier === 'max';

  const [personalityText, setPersonalityText] = useState('');
  const [personalityLoading, setPersonalityLoading] = useState(false);
  const [personalityError, setPersonalityError] = useState('');

  const [careerText, setCareerText] = useState('');
  const [careerLoading, setCareerLoading] = useState(false);
  const [careerError, setCareerError] = useState('');

  const [relText, setRelText] = useState('');
  const [relLoading, setRelLoading] = useState(false);
  const [relError, setRelError] = useState('');

  useEffect(() => {
    if (!isPro || !chart) return;
    setPersonalityLoading(true);
    generatePersonalityReading(chart)
      .then(t => setPersonalityText(t))
      .catch(e => setPersonalityError(e.message))
      .finally(() => setPersonalityLoading(false));

    setCareerLoading(true);
    generateCareerReading(chart)
      .then(t => setCareerText(t))
      .catch(e => setCareerError(e.message))
      .finally(() => setCareerLoading(false));

    setRelLoading(true);
    generateRelationshipsReading(chart)
      .then(t => setRelText(t))
      .catch(e => setRelError(e.message))
      .finally(() => setRelLoading(false));
  }, [isPro]);

  const showAnon = !user;
  const activeText = showAnon ? anonAnalysis : teaserText;
  const activeLoading = showAnon ? anonLoading : teaserLoading;
  const activeError = showAnon ? anonError : teaserError;

  return (
    <div className="screen-container fade-in-up" style={{ maxWidth: 860, margin: '0 auto' }}>

      <div style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Analysis <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 10, textTransform: 'none', letterSpacing: 0, color: 'var(--text-muted)', opacity: 0.7 }}>命理解析</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2 }}>
          Your natal reading
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 300, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.7 }}>
          A full-text interpretation of your chart's structure, element dynamics, and decade-level timing.
        </p>
      </div>

      <SectionDivider en="Overview" zh="概述" chapter="I" />
      <div aria-live="polite" role="status">
        {activeLoading && <AnalysisSkeleton />}
        {activeError && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#d96b54' }}>{activeError}</p>
            {(onRetryTeaser || onRetryAnon) && (
              <button
                onClick={showAnon ? onRetryAnon : onRetryTeaser}
                style={{
                  alignSelf: 'flex-start',
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--text-muted)',
                  background: 'none', border: '1px solid var(--border)',
                  padding: '6px 16px', cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                Retry
              </button>
            )}
          </div>
        )}
        {activeText && <Prose text={activeText} />}
        {!activeLoading && !activeError && !activeText && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)' }}>
            Generating your overview…
          </p>
        )}
      </div>

      <SectionDivider en="Full Natal Reading" zh="完整命理" chapter="II" />
      {tier !== 'free' ? (
        <div aria-live="polite" role="status">
          {natalLoading && <AnalysisSkeleton />}
          {natalError && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#d96b54' }}>{natalError}</p>
              {onRetryNatal && (
                <button
                  onClick={onRetryNatal}
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    background: 'none', border: '1px solid var(--border)',
                    padding: '6px 16px', cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                >
                  Retry
                </button>
              )}
            </div>
          )}
          {natalText && <Prose text={natalText} />}
        </div>
      ) : (
        <NatalBlurGate onUpgrade={onUpgrade} />
      )}

      {tier !== 'free' && (
        <>
          <SectionDivider en="Personality" zh="性格" chapter="III" />
          {personalityLoading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}><Spinner />Reading…</p>}
          {personalityError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#d96b54' }}>{personalityError}</p>}
          {personalityText && <Prose text={personalityText} />}

          <SectionDivider en="Career" zh="事业" chapter="IV" />
          {careerLoading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}><Spinner />Reading…</p>}
          {careerError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#d96b54' }}>{careerError}</p>}
          {careerText && <Prose text={careerText} />}

          <SectionDivider en="Relationships" zh="感情" chapter="V" />
          {relLoading && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}><Spinner />Reading…</p>}
          {relError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#d96b54' }}>{relError}</p>}
          {relText && <Prose text={relText} />}
        </>
      )}

      {!user && (
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', marginBottom: 16 }}>
            BaZi describes patterns and tendencies — not certainties.
          </p>
        </div>
      )}
    </div>
  );
}
