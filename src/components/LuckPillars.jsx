import { useState } from 'react';
import { STEMS, BRANCHES, ELEM } from '../bazi/constants.js';
import { generateLuckPillarReading } from '../api/proAnalysis.js';
import UpgradeNudge from './paywall/UpgradeNudge.jsx';

function Spinner() {
  return (
    <div style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--border)', borderTopColor: 'var(--jade)', animation: 'spin 0.9s linear infinite', verticalAlign: 'middle', marginRight: 6 }} />
  );
}

export default function LuckPillars({ luckPillars, birthYear, currentYear, chart, isPro, onUpgrade }) {
  const { pillars } = luckPillars;
  const currentAge = currentYear - birthYear;
  const [selectedIdx, setSelectedIdx] = useState(null);

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: 16 }}>
        Each column is a 10-year chapter. Click to explore.
      </div>
      <div className="luck-timeline" style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
        {pillars.map((p, i) => {
          const stem = STEMS[p.stemIdx];
          const branch = BRANCHES[p.branchIdx];
          const se = ELEM[stem.element] ?? ELEM.Wood;
          const be = ELEM[branch.element] ?? ELEM.Wood;
          const isCurrent = currentAge >= p.startAge && currentAge < p.endAge;
          const isSelected = selectedIdx === i;
          const colClass = `luck-col-${Math.min(i, 8)}`;

          return (
            <button
              key={i}
              onClick={() => setSelectedIdx(isSelected ? null : i)}
              className={`luck-pillar-btn ${colClass}`}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0', cursor: 'pointer', background: 'none', border: 'none',
                opacity: isCurrent || isSelected ? 1 : 0.28,
                transition: 'opacity 0.2s',
              }}
            >
              <div className="luck-pillar-chars" style={{ paddingTop: 28, paddingBottom: 8 }}>
                <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 24, lineHeight: 1, color: se.hex }}>
                  {stem.char}
                </div>
                <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 24, lineHeight: 1, color: be.hex, marginTop: 8 }}>
                  {branch.char}
                </div>
              </div>

              <div className="luck-pillar-age" style={{
                marginTop: 16, paddingBottom: 8,
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em',
                color: isCurrent ? 'var(--jade)' : 'var(--text-muted)',
              }}>
                {p.startAge}–{p.endAge}
              </div>

              {/* Chevron + "now" indicator */}
              <div className="luck-pillar-now" style={{ height: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingBottom: 20 }}>
                {isCurrent && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: 'var(--jade)',
                  }}>
                    now
                  </span>
                )}
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8,
                  color: isSelected ? 'var(--jade)' : 'var(--text-muted)',
                  display: 'inline-block',
                  transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease, color 0.2s ease',
                }}>
                  ↓
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Animated expand/collapse */}
      <div style={{
        overflow: 'hidden',
        maxHeight: selectedIdx !== null && pillars[selectedIdx] ? 480 : 0,
        transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {selectedIdx !== null && pillars[selectedIdx] && (
          <PillarDetail
            pillar={pillars[selectedIdx]}
            currentAge={currentAge}
            chart={chart}
            isPro={isPro}
            onUpgrade={onUpgrade}
          />
        )}
      </div>
    </div>
  );
}

function PillarDetail({ pillar, currentAge, chart, isPro, onUpgrade }) {
  const stem = STEMS[pillar.stemIdx];
  const branch = BRANCHES[pillar.branchIdx];
  const se = ELEM[stem.element] ?? ELEM.Wood;
  const be = ELEM[branch.element] ?? ELEM.Wood;
  const isCurrent = currentAge >= pillar.startAge && currentAge < pillar.endAge;

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requested, setRequested] = useState(false);

  function request() {
    if (requested || !isPro) return;
    setRequested(true);
    setLoading(true);
    generateLuckPillarReading(chart, pillar, STEMS, BRANCHES)
      .then(t => setText(t))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <div style={{
      marginTop: 40,
      paddingTop: 32,
      borderTop: '1px solid var(--border)',
      display: 'flex', gap: 56, alignItems: 'flex-start',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 56, lineHeight: 1, color: se.hex }}>
            {stem.char}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            {stem.pinyin}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 20, color: 'var(--border)', paddingBottom: 14 }}>·</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 56, lineHeight: 1, color: be.hex }}>
            {branch.char}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            {branch.pinyin}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, fontStyle: 'italic',
            color: 'var(--text)',
          }}>
            {stem.english} · {branch.english}
          </div>
          {isCurrent && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--jade)', padding: '2px 8px',
              border: '1px solid var(--jade-dim)', borderRadius: 4,
            }}>
              Current
            </span>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.1em', marginBottom: 20,
        }}>
          Age {pillar.startAge}–{pillar.endAge}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
            background: se.bg, color: se.hex, border: `1px solid ${se.hex}30`, borderRadius: 4,
          }}>
            {se.zh} {stem.element}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
            background: be.bg, color: be.hex, border: `1px solid ${be.hex}30`, borderRadius: 4,
          }}>
            {be.zh} {branch.element} · {branch.english}
          </span>
        </div>

        {/* AI reading */}
        {isPro ? (
          <>
            {!requested && (
              <button
                onClick={request}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
                  textTransform: 'uppercase', padding: '7px 16px',
                  background: 'none', color: 'var(--jade)',
                  border: '1px solid var(--jade-border)', borderRadius: 4,
                  cursor: 'pointer', transition: 'background 0.2s, transform 0.12s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--jade-bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.transform = 'none'; }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
              >
                Analyse this decade →
              </button>
            )}
            {loading && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                <Spinner />Reading this decade…
              </p>
            )}
            {error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#d96b54' }}>{error}</p>
            )}
            {text && (
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: 'var(--text-dim)', maxWidth: 560, textWrap: 'pretty' }}>
                {text}
              </p>
            )}
          </>
        ) : (
          <UpgradeNudge label="Analyse this decade against your natal chart" onUpgrade={onUpgrade} />
        )}
      </div>
    </div>
  );
}
