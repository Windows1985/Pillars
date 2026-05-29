import { useState } from 'react';
import { STEMS, BRANCHES, ELEM } from '../bazi/constants.js';

export default function LuckPillars({ luckPillars, birthYear, currentYear }) {
  const { pillars } = luckPillars;
  const currentAge = currentYear - birthYear;
  const [selectedIdx, setSelectedIdx] = useState(null);

  return (
    <div>
      <div className="luck-timeline" style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
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
              className="luck-pillar-btn"
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0', cursor: 'pointer', background: 'none', border: 'none',
                opacity: isCurrent || isSelected ? 1 : 0.28,
                transition: 'opacity 0.2s',
              }}
            >
              <div className="luck-pillar-chars" style={{ paddingTop: 22, paddingBottom: 6 }}>
                <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 22, lineHeight: 1, color: se.hex }}>
                  {stem.char}
                </div>
                <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 22, lineHeight: 1, color: be.hex, marginTop: 5 }}>
                  {branch.char}
                </div>
              </div>

              <div className="luck-pillar-age" style={{
                marginTop: 14, paddingBottom: 6,
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em',
                color: isCurrent ? 'var(--jade)' : 'var(--text-muted)',
              }}>
                {p.startAge}
              </div>

              <div className="luck-pillar-now" style={{ height: 14, display: 'flex', alignItems: 'center', paddingBottom: 16 }}>
                {isCurrent && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: 'var(--jade)',
                  }}>
                    now
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

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
      marginTop: 48,
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
