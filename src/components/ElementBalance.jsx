import { ELEMENTS, ELEM } from '../bazi/constants.js';

const ELEMS_ORDER = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const ANGLES = [90, 18, -54, -126, -198].map(d => (d * Math.PI) / 180);
const CX = 100, CY = 100, MAX_R = 66, MIN_R = 4;

function pt(a, r) {
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
}

function RadarChart({ totals, total, dominantEl }) {
  const gridRings = [0.3, 0.6, 1].map(f =>
    ANGLES.map(a => pt(a, MAX_R * f)).map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  );

  const dataPts = ELEMS_ORDER.map((el, i) => {
    const score = totals[el] ?? 0;
    const proportion = total > 0 ? score / total : 0;
    const r = MIN_R + Math.min(1, proportion * 3.5) * (MAX_R - MIN_R);
    return pt(ANGLES[i], r);
  });

  const dataPolygon = dataPts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const de = ELEM[dominantEl] ?? ELEM.Earth;

  return (
    <svg width="200" height="200" viewBox="-15 -15 230 230" style={{ overflow: 'visible', flexShrink: 0 }}>
      {gridRings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="var(--border)" strokeWidth={0.6} />
      ))}
      {ANGLES.map((a, i) => {
        const [x, y] = pt(a, MAX_R);
        return <line key={i} x1={CX} y1={CY} x2={x.toFixed(2)} y2={y.toFixed(2)} stroke="var(--border)" strokeWidth={0.6} />;
      })}
      {/* Draw-in animation on the data polygon */}
      <polygon className="radar-polygon" points={dataPolygon} fill={de.bg} stroke={de.hex} strokeWidth={1.5} strokeLinejoin="round" opacity={0.9} />
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={3.5} fill={ELEM[ELEMS_ORDER[i]]?.hex ?? '#888'} stroke="var(--surface-0)" strokeWidth={1} />
      ))}
      {ELEMS_ORDER.map((el, i) => {
        const [lx, ly] = pt(ANGLES[i], MAX_R + 18);
        return (
          <text key={el} x={lx.toFixed(2)} y={ly.toFixed(2)} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={ELEM[el].hex} fontFamily="'Noto Serif SC', serif">
            <tspan>{ELEM[el].zh} {el}</tspan>
          </text>
        );
      })}
    </svg>
  );
}

export default function ElementBalance({ balance, dayMaster }) {
  const { totals, total, strong, balancingElement } = balance;
  const dmElement = dayMaster.stem.element;

  const dominantEl = ELEMS_ORDER.reduce((a, b) => (totals[a] ?? 0) >= (totals[b] ?? 0) ? a : b);

  return (
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
      <RadarChart totals={totals} total={total} dominantEl={dominantEl} />

      <div style={{ flex: 1, paddingTop: 8 }}>
        {/* Strong / Weak */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Day Master
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
              padding: '3px 10px', borderRadius: 4,
              ...(strong
                ? { color: '#c4913a', background: 'rgba(196,145,58,0.08)', border: '1px solid rgba(196,145,58,0.2)' }
                : { color: 'var(--jade)', background: 'var(--jade-bg)', border: '1px solid var(--jade-border)' }),
            }}>
              {strong ? 'Strong 旺' : 'Weak 弱'}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', lineHeight: 1.6 }}>
            Strong: thrives with challenge and independence · Weak: benefits from support and collaboration
          </div>
        </div>

        {/* Element scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
          {ELEMENTS.map((el, idx) => {
            const score = totals[el] ?? 0;
            const pct = total > 0 ? (score / total) * 100 : 0;
            const isDM = el === dmElement;
            const e = ELEM[el];
            return (
              <div key={el} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontFamily: 'var(--font-cjk)', fontSize: 14, width: 18, textAlign: 'center',
                  color: e.hex, fontWeight: isDM ? 600 : 400, flexShrink: 0,
                }}>
                  {e.zh}
                </span>
                <div style={{ flex: 1, height: 2, background: 'var(--border)', position: 'relative', borderRadius: 2 }}>
                  <div
                    className="balance-bar"
                    style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${pct}%`, background: e.hex, opacity: isDM ? 1 : 0.5,
                      borderRadius: 2,
                      animationDelay: `${idx * 80}ms`,
                    }}
                  />
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, width: 28, textAlign: 'right',
                  color: isDM ? 'var(--text-dim)' : 'var(--text-muted)', flexShrink: 0,
                }}>
                  {score.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Suggested balance */}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            To strengthen your chart
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 24, color: ELEM[balancingElement.primaryElement]?.hex ?? '#c4913a' }}>
              {ELEM[balancingElement.primaryElement]?.zh}
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 300, color: 'var(--jade)' }}>
                {balancingElement.primaryElement}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', marginTop: 3, letterSpacing: '0.06em' }}>
                {balancingElement.reason}
              </div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.65 }}>
            Invite more {balancingElement.primaryElement} energy into your environment and timing of decisions.
          </div>
        </div>
      </div>
    </div>
  );
}
