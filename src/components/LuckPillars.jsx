import { useState } from 'react';
import { STEMS, BRANCHES, ELEM } from '../bazi/constants.js';

export default function LuckPillars({ luckPillars, birthYear, currentYear }) {
  const { forward, startingAge, pillars } = luckPillars;
  const age = currentYear - birthYear;
  const [selected, setSelected] = useState(null);

  function isCurrent(p) {
    return age >= p.startAge && age < p.endAge;
  }

  const sel = selected !== null ? pillars[selected] : null;
  const selStem = sel ? STEMS[sel.stemIdx] : null;
  const selBranch = sel ? BRANCHES[sel.branchIdx] : null;
  const selSe = selStem ? (ELEM[selStem.element] ?? ELEM.Wood) : null;
  const selBe = selBranch ? (ELEM[selBranch.element] ?? ELEM.Wood) : null;

  return (
    <div
      className="card-hover rounded-[22px] p-6"
      style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Meta row */}
      <div className="flex items-center gap-5 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: '#2e2c2a' }}>Begins age</div>
          <div className="text-base font-medium" style={{ color: '#e8e4dd' }}>{startingAge}</div>
        </div>
        <div className="w-px h-8 self-center" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: '#2e2c2a' }}>Direction</div>
          <div className="text-sm" style={{ color: '#5a5754' }}>{forward ? 'Forward 顺' : 'Backward 逆'}</div>
        </div>
        <div className="w-px h-8 self-center" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: '#2e2c2a' }}>Current age</div>
          <div className="text-sm" style={{ color: '#5a5754' }}>{age}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative overflow-x-auto -mx-2 px-2">
        <div
          className="absolute"
          style={{
            top: 52,
            left: 28,
            right: 28,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          }}
        />

        <div className="flex justify-between min-w-max gap-1" style={{ minWidth: '100%' }}>
          {pillars.map((p, i) => {
            const current = isCurrent(p);
            const isSelected = selected === i;
            const stem = STEMS[p.stemIdx];
            const branch = BRANCHES[p.branchIdx];
            const se = ELEM[stem.element] ?? ELEM.Wood;
            const be = ELEM[branch.element] ?? ELEM.Wood;

            return (
              <button
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className="flex flex-col items-center gap-2 relative"
                style={{
                  minWidth: 56,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 10,
                  padding: '6px 8px',
                  outline: isSelected ? `1px solid ${se.hex}40` : '1px solid transparent',
                  transition: 'outline 0.2s',
                }}
              >
                <div className="cjk text-xl leading-none" style={{ color: se.hex, opacity: current ? 1 : 0.55 }}>
                  {stem.char}
                </div>

                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: current || isSelected ? se.hex : 'rgba(255,255,255,0.12)',
                    boxShadow: current ? `0 0 12px ${se.hex}, 0 0 24px ${se.glow}` : 'none',
                    zIndex: 1,
                    animation: current ? 'glowPulse 2.5s ease-in-out infinite' : 'none',
                    flexShrink: 0,
                  }}
                />

                <div className="cjk text-xl leading-none" style={{ color: be.hex, opacity: current ? 1 : 0.55 }}>
                  {branch.char}
                </div>

                <div className="text-[9px] text-center leading-tight" style={{ color: current ? '#5a5754' : '#2e2c2a' }}>
                  {p.startAge}
                </div>

                {current && (
                  <div className="text-[8px] font-semibold tracking-wider uppercase" style={{ color: '#c4913a' }}>
                    Now
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {sel && selStem && selBranch && selSe && selBe && (
        <div
          className="mt-5 rounded-[14px] px-5 py-4"
          style={{
            background: '#080809',
            border: `1px solid ${selSe.hex}20`,
            animation: 'fadeIn 0.18s ease',
          }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="cjk text-2xl" style={{ color: selSe.hex }}>{selStem.char}</span>
            <span className="cjk text-2xl" style={{ color: selBe.hex }}>{selBranch.char}</span>
            <div className="ml-1">
              <div className="text-[11px] font-medium" style={{ color: '#e8e4dd' }}>
                {selStem.pinyin} {selBranch.pinyin}
              </div>
              <div className="text-[10px]" style={{ color: '#4a4844' }}>
                Age {sel.startAge}–{sel.endAge}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: '#2e2c2a' }}>Stem</div>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: selSe.bg, color: selSe.hex, border: `1px solid ${selSe.hex}30` }}
              >
                {selSe.zh} {selStem.element} · {selStem.english}
              </span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: '#2e2c2a' }}>Branch</div>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: selBe.bg, color: selBe.hex, border: `1px solid ${selBe.hex}30` }}
              >
                {selBe.zh} {selBranch.element} · {selBranch.english}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
