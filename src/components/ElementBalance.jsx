import { ResponsiveBar } from '@nivo/bar';
import { ELEM } from '../bazi/constants.js';

// Wood→top requires Wood last in array (nivo horizontal renders bottom-to-top)
const ELEMS_DISPLAY = ['Water', 'Metal', 'Earth', 'Fire', 'Wood'];

const nivoTheme = {
  background: 'transparent',
  text: { fill: '#9ca3af', fontSize: 11 },
  grid: { line: { stroke: '#1f2937', strokeWidth: 1 } },
  axis: {
    ticks: { text: { fill: '#9ca3af', fontSize: 13 }, line: { stroke: 'transparent' } },
  },
};

export default function ElementBalance({ balance, dayMaster }) {
  const { totals, strong, balancingElement } = balance;
  const dmElement = dayMaster.stem.element;

  const barData = ELEMS_DISPLAY.map(el => {
    const raw = totals[el] ?? 0;
    return {
      id: el,
      score: raw > 0 ? raw : 0.01,
      rawScore: raw,
      color: ELEM[el].hex,
      zh: ELEM[el].zh,
      isDM: el === dmElement,
    };
  });

  const maxVal = Math.max(...barData.map(d => d.rawScore), 0.1);
  const rawByEl = Object.fromEntries(barData.map(d => [d.id, d]));

  // Custom layer: value labels rendered outside (right of) each bar
  const ValueLabels = ({ bars }) => (
    <>
      {bars.map(bar => {
        const d = rawByEl[String(bar.data.indexValue)];
        const raw = d?.rawScore ?? 0;
        return (
          <text
            key={bar.key}
            x={bar.x + bar.width + 8}
            y={bar.y + bar.height / 2}
            textAnchor="start"
            dominantBaseline="middle"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fill: raw === 0 ? 'rgba(156,163,175,0.3)' : (d?.color ?? '#9ca3af'),
            }}
          >
            {raw.toFixed(1)}
          </text>
        );
      })}
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 220, marginBottom: 32 }}>
        <ResponsiveBar
          data={barData}
          keys={['score']}
          indexBy="id"
          layout="horizontal"
          valueScale={{ type: 'linear', min: 0, max: maxVal * 1.25 }}
          indexScale={{ type: 'band', round: true }}
          colors={({ data }) => data.color}
          padding={0.38}
          borderRadius={0}
          enableGridX={false}
          enableGridY={false}
          enableLabel={false}
          layers={['grid', 'axes', 'bars', 'markers', 'legends', 'annotations', ValueLabels]}
          axisLeft={{
            tickSize: 0,
            tickPadding: 16,
            renderTick: ({ x, y, value, textAnchor }) => (
              <g transform={`translate(${x},${y})`}>
                <text
                  textAnchor={textAnchor ?? 'end'}
                  dominantBaseline="middle"
                  style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 14, fill: ELEM[value]?.hex ?? '#9ca3af' }}
                >
                  {ELEM[value]?.zh ?? value}
                </text>
              </g>
            ),
          }}
          axisBottom={null}
          axisTop={null}
          axisRight={null}
          margin={{ top: 4, right: 52, bottom: 4, left: 32 }}
          theme={nivoTheme}
          isInteractive={false}
          animate={true}
          motionConfig="gentle"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        {/* Strong / Weak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Day Master
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
            padding: '3px 10px',
            ...(strong
              ? { color: '#c4913a', background: 'rgba(196,145,58,0.08)', border: '1px solid rgba(196,145,58,0.2)' }
              : { color: 'var(--jade)', background: 'var(--jade-bg)', border: '1px solid var(--jade-dim)' }),
          }}>
            {strong ? 'Strong 旺' : 'Weak 弱'}
          </span>
        </div>

        {/* Suggested balance */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
            Suggested Balance
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 20, color: ELEM[balancingElement.primaryElement]?.hex ?? '#c4913a' }}>
              {ELEM[balancingElement.primaryElement]?.zh}
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 300, color: 'var(--text-dim)' }}>
                {balancingElement.primaryElement}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.06em' }}>
                {balancingElement.reason}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
