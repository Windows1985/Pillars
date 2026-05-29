import BlurGate from './paywall/BlurGate.jsx';

function AnalysisSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0' }}>
      {[100, 88, 96, 72, 84, 60, 90, 50].map((w, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: `${w}%`, height: 14, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

function Prose({ text, dim }) {
  return (
    <div className="space-y-5">
      {text.split('\n\n').filter(p => p.trim()).map((para, i) => (
        <p key={i} className="leading-[1.8]" style={{ fontSize: 15, color: dim ? 'var(--text-muted)' : (i === 0 ? '#e8e4dd' : 'var(--text-dim)') }}>
          {para.trim()}
        </p>
      ))}
    </div>
  );
}

export default function Analysis({ teaserText, teaserLoading, teaserError, natalText, natalLoading, natalError, tier, onUpgrade }) {
  const hasAnything = teaserText || teaserLoading || teaserError || natalText || natalLoading || natalError;
  if (!hasAnything) return null;

  return (
    <div className="card-hover rounded-[22px] p-7" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Free teaser */}
      {(teaserLoading || teaserError || teaserText) && (
        <div className="mb-6 pb-6" style={{ borderBottom: tier !== 'free' ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          {teaserLoading && <AnalysisSkeleton />}
          {teaserError && <p className="text-[13px]" style={{ color: '#d96b54' }}>{teaserError}</p>}
          {teaserText && (
            <>
              <Prose text={teaserText} dim={false} />
              {tier === 'free' && (
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>BaZi describes patterns and tendencies — not certainties.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Full natal analysis (Pro+) */}
      {tier !== 'free' ? (
        <div>
          {natalLoading && <AnalysisSkeleton />}
          {natalError && <p className="text-[13px]" style={{ color: '#d96b54' }}>{natalError}</p>}
          {natalText && (
            <>
              <Prose text={natalText} dim={false} />
              <p className="text-[11px] mt-5 pt-3" style={{ color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                BaZi describes patterns and tendencies — not certainties. Interpretations are probabilistic.
              </p>
            </>
          )}
        </div>
      ) : (
        <BlurGate required="pro" current="free" label="Full natal analysis: personality, career, relationships, wealth & health" onUpgrade={onUpgrade}>
          <div className="space-y-3 py-2">
            {[82, 68, 90, 55, 74, 61, 80, 45, 70, 58].map((w, i) => (
              <div key={i} className="rounded-full" style={{ width: `${w}%`, height: 8, background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        </BlurGate>
      )}
    </div>
  );
}
