import { useState } from 'react';
import { STEMS, BRANCHES, ELEM } from '../bazi/constants.js';

export default function LuckPillars({ luckPillars, birthYear, currentYear }) {
  const { startingAge, pillars } = luckPillars;
  const currentAge = currentYear - birthYear;
  const [selectedIdx, setSelectedIdx] = useState(null);

  const timelineSpan = 80;
  const currentPct = Math.max(0, Math.min(100, ((currentAge - startingAge) / timelineSpan) * 100));
  const isInTimeline = currentAge >= startingAge && currentAge < startingAge + timelineSpan;

  return (
    <div>
      {/* Character row */}
      <div style={{ display: 'flex', marginBottom: 32 }}>
        {pillars.map((p, i) => {
          const stem = STEMS[p.stemIdx];
          const branch = BRANCHES[p.branchIdx];
          const se = ELEM[stem.element] ?? ELEM.Wood;
          const be = ELEM[branch.element] ?? ELEM.Wood;
          const isCurrent = currentAge >= p.startAge && currentAge < p.endAge;
          const isSelected = selectedIdx === i;

          return (
            <button
              key={i}
              onClick={() => setSelectedIdx(isSelected ? null : i)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, padding: '6px 4px', cursor: 'pointer',
                background: 'none', border: 'none',
                opacity: isCurrent || isSelected ? 1 : 0.35,
                transition: 'opacity 0.2s',
              }}
            >
              <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 22, lineHeight: 1, color: se.hex }}>
                {stem.char}
              </span>
              <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 22, lineHeight: 1, color: be.hex }}>
                {branch.char}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bar track — position:relative so cursor is anchored here */}
      <div style={{ position: 'relative' }}>
        <div style={{ height: 2, background: 'var(--border)' }}>
          {/* Current decade fill */}
          {pillars.map((p, i) => {
            const isCurrent = currentAge >= p.startAge && currentAge < p.endAge;
            return isCurrent ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(i / 8) * 100}%`,
                  width: `${100 / 8}%`,
                  height: '100%',
                  background: 'var(--jade)',
                }}
              />
            ) : null;
          })}
        </div>

        {/* Current age cursor — spans above and below the bar */}
        {isInTimeline && (
          <div
            style={{
              position: 'absolute',
              left: `${currentPct}%`,
              top: -12,
              transform: 'translateX(-50%)',
              width: 1,
              height: 28,
              background: 'var(--jade)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Age label row */}
        <div style={{ display: 'flex', marginTop: 12 }}>
          {pillars.map((p, i) => {
            const isCurrent = currentAge >= p.startAge && currentAge < p.endAge;
            return (
              <button
                key={i}
                onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                style={{
                  flex: 1, textAlign: 'center', cursor: 'pointer',
                  background: 'none', border: 'none', padding: '4px 0',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em',
                  color: isCurrent ? 'var(--jade)' : 'var(--text-muted)',
                }}>
                  {p.startAge}
                </span>
              </button>
            );
          })}
        </div>

        {/* "now" label below age row, pinned to cursor position */}
        {isInTimeline && (
          <div style={{
            position: 'absolute',
            left: `${currentPct}%`,
            top: 36,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--jade)', whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {currentAge} · now
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedIdx !== null && pillars[selectedIdx] && (
        <PillarDetail pillar={pillars[selectedIdx]} currentAge={currentAge} />
      )}
    </div>
  );
}

function PillarDetail({ pillar, currentAge }) {
  const stem = STEMS[pillar.stemIdx];
  const branch = BRANCHES[pillar.branchIdx];
  const se = ELEM[stem.element] ?? ELEM.Wood;
  const be = ELEM[branch.element] ?? ELEM.Wood;
  const isCurrent = currentAge >= pillar.startAge && currentAge < pillar.endAge;

  return (
    <div style={{
      marginTop: 56,
      paddingTop: 32,
      borderTop: '1px solid var(--border)',
      display: 'flex', gap: 48, alignItems: 'flex-start',
    }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 56, lineHeight: 1, color: se.hex }}>
            {stem.char}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            {stem.pinyin}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 20, color: 'var(--border)', paddingBottom: 14 }}>·</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 56, lineHeight: 1, color: be.hex }}>
            {branch.char}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            {branch.pinyin}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
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
              border: '1px solid var(--jade-dim)',
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
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
            background: se.bg, color: se.hex, border: `1px solid ${se.hex}30`,
          }}>
            {se.zh} {stem.element}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
            background: be.bg, color: be.hex, border: `1px solid ${be.hex}30`,
          }}>
            {be.zh} {branch.element} · {branch.english}
          </span>
        </div>
      </div>
    </div>
  );
}
