import { ELEMENTS, ELEM } from '../bazi/constants.js';

// Pentagon radar chart
const ELEMS_ORDER = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const ANGLES = [90, 18, -54, -126, -198].map(d => (d * Math.PI) / 180);
const CX = 100, CY = 100, MAX_R = 66, MIN_R = 4;

function pt(angleRad, r) {
  return [CX + r * Math.cos(angleRad), CY - r * Math.sin(angleRad)];
}

function toPoints(pairs) {
  return pairs.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

function RadarChart({ totals, total, dominantEl }) {
  const gridRings = [0.3, 0.6, 1].map(f =>
    toPoints(ANGLES.map(a => pt(a, MAX_R * f)))
  );

  const dataPts = ELEMS_ORDER.map((el, i) => {
    const score = totals[el] ?? 0;
    const proportion = total > 0 ? score / total : 0;
    const scaled = Math.min(1, proportion * 3.5);
    const r = MIN_R + scaled * (MAX_R - MIN_R);
    return pt(ANGLES[i], r);
  });

  const dataPolygon = toPoints(dataPts);
  const de = ELEM[dominantEl] ?? ELEM.Earth;

  return (
    <svg width="220" height="220" viewBox="-15 -15 230 230" style={{ overflow: 'visible' }}>
      {/* Grid rings */}
      {gridRings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
      ))}

      {/* Axis lines */}
      {ANGLES.map((a, i) => {
        const [x, y] = pt(a, MAX_R);
        return <line key={i} x1={CX} y1={CY} x2={x.toFixed(2)} y2={y.toFixed(2)} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />;
      })}

      {/* Data fill */}
      <polygon
        points={dataPolygon}
        fill={de.bg}
        stroke={de.hex}
        strokeWidth={1.5}
        strokeLinejoin="round"
        opacity={0.9}
      />

      {/* Dots */}
      {dataPts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x.toFixed(2)} cy={y.toFixed(2)}
          r={3.5}
          fill={ELEM[ELEMS_ORDER[i]]?.hex ?? '#888'}
          stroke="rgba(7,7,9,0.8)"
          strokeWidth={1}
        />
      ))}

      {/* Labels */}
      {ELEMS_ORDER.map((el, i) => {
        const [lx, ly] = pt(ANGLES[i], MAX_R + 18);
        const e = ELEM[el];
        return (
          <text
            key={el}
            x={lx.toFixed(2)} y={ly.toFixed(2)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={13}
            fill={e.hex}
            fontFamily="'Noto Serif SC', serif"
          >
            {e.zh}
          </text>
        );
      })}
    </svg>
  );
}

export default function ElementBalance({ balance, dayMaster }) {
  const { totals, total, strong, balancingElement } = balance;
  const dmElement = dayMaster.stem.element;

  const dominantEl = ELEMS_ORDER.reduce((a, b) =>
    (totals[a] ?? 0) >= (totals[b] ?? 0) ? a : b
  );

  return (
    <div
      className="card-hover rounded-[22px] p-6"
      style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radar chart */}
        <div className="flex-shrink-0">
          <RadarChart totals={totals} total={total} dominantEl={dominantEl} />
        </div>

        {/* Sidebar */}
        <div className="flex-1 space-y-4">
          {/* Strength */}
          <div
            className="flex items-center justify-between rounded-[12px] px-4 py-3"
            style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-sm" style={{ color: '#5a5754' }}>Day Master</span>
            <span
              className="text-sm font-medium px-3 py-0.5 rounded-full"
              style={strong
                ? { background: 'rgba(196,145,58,0.12)', color: '#c4913a', border: '1px solid rgba(196,145,58,0.25)' }
                : { background: 'rgba(85,146,184,0.1)', color: '#5592b8', border: '1px solid rgba(85,146,184,0.2)' }
              }
            >
              {strong ? 'Strong 旺' : 'Weak 弱'}
            </span>
          </div>

          {/* Scores */}
          <div className="space-y-2">
            {ELEMENTS.map(el => {
              const score = totals[el] ?? 0;
              const pct = total > 0 ? (score / total) * 100 : 0;
              const isDM = el === dmElement;
              const e = ELEM[el];
              return (
                <div key={el} className="flex items-center gap-3">
                  <span
                    className="cjk text-sm w-5 text-center"
                    style={{ color: e.hex, fontWeight: isDM ? 600 : 400 }}
                  >
                    {e.zh}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: e.hex,
                        opacity: isDM ? 1 : 0.5,
                        boxShadow: isDM ? `0 0 8px ${e.glow}` : 'none',
                      }}
                    />
                  </div>
                  <span className="text-[12px] tabular-nums w-7 text-right" style={{ color: isDM ? '#e8e4dd' : '#4a4844' }}>
                    {score.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Balancing element */}
          <div className="pt-1">
            <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: '#3a3733' }}>
              Suggested Balance
            </div>
            <div className="flex items-center gap-2">
              <span
                className="cjk text-lg"
                style={{ color: ELEM[balancingElement.primaryElement]?.hex ?? '#c4913a' }}
              >
                {ELEM[balancingElement.primaryElement]?.zh}
              </span>
              <span className="text-sm" style={{ color: '#5a5754' }}>
                {balancingElement.primaryElement}
              </span>
              <span className="text-[12px]" style={{ color: '#3a3733' }}>
                · {balancingElement.reason}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
