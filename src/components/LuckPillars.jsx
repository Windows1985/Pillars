import { STEMS, BRANCHES, ELEMENT_COLORS } from '../bazi/constants.js';

const ELEMENT_BAR_COLOR = {
  Wood:  '#4ade80',
  Fire:  '#f87171',
  Earth: '#fbbf24',
  Metal: '#94a3b8',
  Water: '#60a5fa',
};

export default function LuckPillars({ luckPillars, birthYear, currentYear }) {
  const { forward, startingAge, pillars } = luckPillars;
  const age = currentYear - birthYear;

  function isCurrentPillar(p) {
    return age >= p.startAge && age < p.endAge;
  }

  return (
    <div
      className="rounded-lg p-5 space-y-5"
      style={{ border: '1px solid #1e1e22', background: '#131316' }}
    >
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <h2 className="text-base font-medium" style={{ color: '#ece8e1' }}>Luck Pillars</h2>
          <span className="text-sm font-serif" style={{ color: '#3d3a37' }}>大运</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#5a5754' }}>
          Life unfolds in ten-year chapters called Luck Pillars. Each one overlays a new stem-branch pair onto your natal chart, shifting the energetic climate of that decade. The current chapter is highlighted.
        </p>
      </div>

      {/* Meta row */}
      <div
        className="flex items-center gap-4 rounded px-3 py-2"
        style={{ background: '#0c0c0e', border: '1px solid #1e1e22' }}
      >
        <div title="The age at which your first Luck Pillar begins. Calculated from the days between your birth and the nearest solar term, divided by three.">
          <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: '#3d3a37' }}>Starts age</div>
          <div className="text-sm font-medium" style={{ color: '#ece8e1' }}>{startingAge}</div>
        </div>
        <div
          className="w-px self-stretch"
          style={{ background: '#1e1e22' }}
        />
        <div title="Direction is determined by your gender and whether the year of your birth has a Yang (even) or Yin (odd) stem. Forward cycles run with the 60-cycle sequence; backward cycles run against it.">
          <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: '#3d3a37' }}>Cycle direction</div>
          <div className="text-xs font-medium" style={{ color: '#ece8e1' }}>
            {forward ? 'Forward 顺' : 'Backward 逆'}
          </div>
        </div>
        <div
          className="w-px self-stretch"
          style={{ background: '#1e1e22' }}
        />
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: '#3d3a37' }}>Current age</div>
          <div className="text-xs font-medium" style={{ color: '#ece8e1' }}>{age}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-2 min-w-max pb-1">
          {pillars.map((p, i) => {
            const current = isCurrentPillar(p);
            const stem = STEMS[p.stemIdx];
            const branch = BRANCHES[p.branchIdx];
            const stemColor = ELEMENT_BAR_COLOR[stem.element] ?? '#ece8e1';
            const branchColor = ELEMENT_BAR_COLOR[branch.element] ?? '#ece8e1';

            return (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg"
                style={{
                  border: current ? '1px solid rgba(196,145,58,0.4)' : '1px solid #1e1e22',
                  background: current ? 'rgba(196,145,58,0.04)' : '#0c0c0e',
                  minWidth: 64,
                }}
                title={`${stem.char} ${stem.pinyin} (${stem.english} ${stem.element}) · ${branch.char} ${branch.pinyin} (${branch.english} ${branch.element})\nAge ${p.startAge}–${p.endAge}`}
              >
                {current && (
                  <div
                    className="text-[9px] uppercase tracking-widest font-medium"
                    style={{ color: '#c4913a' }}
                  >
                    Now
                  </div>
                )}

                <div
                  className="font-serif text-2xl leading-none"
                  style={{ color: stemColor }}
                >
                  {stem.char}
                </div>
                <div
                  className="text-[9px] leading-none"
                  style={{ color: '#3d3a37' }}
                >
                  {stem.pinyin}
                </div>

                <div
                  className="w-4 my-0.5"
                  style={{ height: 1, background: '#1e1e22' }}
                />

                <div
                  className="font-serif text-2xl leading-none"
                  style={{ color: branchColor }}
                >
                  {branch.char}
                </div>
                <div
                  className="text-[9px] leading-none"
                  style={{ color: '#3d3a37' }}
                >
                  {branch.pinyin}
                </div>

                <div
                  className="text-[10px] text-center leading-tight mt-1"
                  style={{ color: current ? '#5a5754' : '#3d3a37' }}
                >
                  {p.startAge}–{p.endAge}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] leading-relaxed" style={{ color: '#3d3a37' }}>
        Hover any pillar to see the stem and branch details. Each decade's character pair interacts with your natal chart — combinations and clashes during that period reflect the dominant themes of that chapter of life.
      </p>
    </div>
  );
}
