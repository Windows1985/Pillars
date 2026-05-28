import { STEMS, BRANCHES, ELEM } from '../bazi/constants.js';

export default function LuckPillars({ luckPillars, birthYear, currentYear }) {
  const { forward, startingAge, pillars } = luckPillars;
  const age = currentYear - birthYear;

  function isCurrent(p) {
    return age >= p.startAge && age < p.endAge;
  }

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
        {/* Connecting line */}
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
            const stem = STEMS[p.stemIdx];
            const branch = BRANCHES[p.branchIdx];
            const se = ELEM[stem.element] ?? ELEM.Wood;
            const be = ELEM[branch.element] ?? ELEM.Wood;

            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-2 relative"
                style={{ minWidth: 56 }}
                title={`${stem.char} ${stem.pinyin} · ${branch.char} ${branch.pinyin}\nAge ${p.startAge}–${p.endAge}`}
              >
                {/* Stem */}
                <div
                  className="cjk text-xl leading-none"
                  style={{ color: se.hex, opacity: current ? 1 : 0.55 }}
                >
                  {stem.char}
                </div>

                {/* Node */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: current ? se.hex : 'rgba(255,255,255,0.12)',
                    boxShadow: current ? `0 0 12px ${se.hex}, 0 0 24px ${se.glow}` : 'none',
                    zIndex: 1,
                    animation: current ? 'glowPulse 2.5s ease-in-out infinite' : 'none',
                    flexShrink: 0,
                  }}
                />

                {/* Branch */}
                <div
                  className="cjk text-xl leading-none"
                  style={{ color: be.hex, opacity: current ? 1 : 0.55 }}
                >
                  {branch.char}
                </div>

                {/* Age */}
                <div
                  className="text-[9px] text-center leading-tight"
                  style={{ color: current ? '#5a5754' : '#2e2c2a' }}
                >
                  {p.startAge}
                </div>

                {current && (
                  <div
                    className="text-[8px] font-semibold tracking-wider uppercase"
                    style={{ color: '#c4913a' }}
                  >
                    Now
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
