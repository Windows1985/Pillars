import { ELEMENTS, ELEMENT_COLORS } from '../bazi/constants.js';

const ELEMENT_DESCRIPTIONS = {
  Wood:  { zh: '木', glyph: '木', desc: 'Growth, vision, flexibility. Governs creativity, planning, and expansion.' },
  Fire:  { zh: '火', glyph: '火', desc: 'Passion, expression, intelligence. Governs communication and dynamism.' },
  Earth: { zh: '土', glyph: '土', desc: 'Stability, reliability, nurturing. Governs practicality and support.' },
  Metal: { zh: '金', glyph: '金', desc: 'Precision, discipline, resolve. Governs structure and decisiveness.' },
  Water: { zh: '水', glyph: '水', desc: 'Wisdom, adaptability, depth. Governs intuition and flow.' },
};

const ELEMENT_BAR_COLOR = {
  Wood:  '#4ade80',
  Fire:  '#f87171',
  Earth: '#fbbf24',
  Metal: '#94a3b8',
  Water: '#60a5fa',
};

export default function ElementBalance({ balance, dayMaster }) {
  const { totals, total, strong, balancingElement } = balance;
  const dmElement = dayMaster.stem.element;

  const sortedElements = [...ELEMENTS].sort((a, b) => (totals[b] ?? 0) - (totals[a] ?? 0));
  const dominantEl = sortedElements[0];
  const weakestEl = sortedElements[sortedElements.length - 1];

  return (
    <div
      className="rounded-lg p-5 space-y-5"
      style={{ border: '1px solid #1e1e22', background: '#131316' }}
    >
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <h2 className="text-base font-medium" style={{ color: '#ece8e1' }}>Element Balance</h2>
          <span className="text-sm font-serif" style={{ color: '#3d3a37' }}>五行分布</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#5a5754' }}>
          Your chart is scored by how much of each of the five elements — Wood, Fire, Earth, Metal, Water — appears across all eight characters (stems and hidden stems). Balance shapes your strengths, blind spots, and what energies tend to help you.
        </p>
      </div>

      {/* Day master strength badge */}
      <div
        className="flex items-center justify-between rounded px-3 py-2"
        style={{ background: '#0c0c0e', border: '1px solid #1e1e22' }}
        title="Strong Day Master (旺): your core element is well-supported. Challenging or draining elements tend to be more useful to you. Weak Day Master (弱): your core element needs support — nurturing and same-element energies tend to help most."
      >
        <div className="text-xs" style={{ color: '#5a5754' }}>
          Day Master strength
        </div>
        <div
          className="text-xs font-medium px-2 py-0.5 rounded-sm"
          style={{
            background: strong ? 'rgba(196,145,58,0.1)' : 'rgba(100,116,139,0.15)',
            color: strong ? '#c4913a' : '#94a3b8',
            border: strong ? '1px solid rgba(196,145,58,0.25)' : '1px solid rgba(100,116,139,0.2)',
          }}
        >
          {strong ? 'Strong 旺' : 'Weak 弱'}
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-2.5">
        {ELEMENTS.map(el => {
          const score = totals[el] ?? 0;
          const pct = total > 0 ? (score / total) * 100 : 0;
          const isDM = el === dmElement;
          const meta = ELEMENT_DESCRIPTIONS[el];
          return (
            <div key={el} title={`${el} ${meta.zh}: ${meta.desc}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium w-12"
                    style={{ color: ELEMENT_BAR_COLOR[el] }}
                  >
                    {el}
                  </span>
                  <span className="text-[10px]" style={{ color: '#3d3a37' }}>{meta.zh}</span>
                  {isDM && (
                    <span
                      className="text-[9px] px-1 py-0.5 rounded-sm"
                      style={{ background: 'rgba(196,145,58,0.1)', color: '#c4913a' }}
                    >
                      Day Master
                    </span>
                  )}
                </div>
                <span className="text-[11px] tabular-nums" style={{ color: isDM ? '#ece8e1' : '#5a5754' }}>
                  {score.toFixed(1)}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: '#1a1a1e' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: ELEMENT_BAR_COLOR[el],
                    opacity: isDM ? 1 : 0.5,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight row */}
      <div
        className="rounded px-3 py-3 space-y-2"
        style={{ background: '#0c0c0e', border: '1px solid #1e1e22' }}
      >
        <div className="text-xs" style={{ color: '#5a5754' }}>
          <span style={{ color: '#3d3a37' }}>Dominant · </span>
          <span style={{ color: ELEMENT_BAR_COLOR[dominantEl] }}>{dominantEl}</span>
          <span className="mx-2" style={{ color: '#3d3a37' }}>·</span>
          <span style={{ color: '#3d3a37' }}>Weakest · </span>
          <span style={{ color: ELEMENT_BAR_COLOR[weakestEl] }}>{weakestEl}</span>
        </div>

        <div className="text-xs leading-relaxed">
          <span style={{ color: '#5a5754' }}>Suggested balancing element · </span>
          <span className="font-medium" style={{ color: ELEMENT_BAR_COLOR[balancingElement.primaryElement] }}>
            {balancingElement.primaryElement}
          </span>
          <span className="ml-1" style={{ color: '#3d3a37' }}>({balancingElement.reason})</span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: '#3d3a37' }}>
          The balancing element is the one your chart tends to respond well to — it may appear in your luck pillars, the people around you, or environments where you feel most effective.
        </p>
      </div>
    </div>
  );
}
