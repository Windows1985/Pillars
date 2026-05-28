import { ELEM } from '../bazi/constants.js';

const PILLAR_NAMES = ['Year 年', 'Month 月', 'Day 日', 'Hour 时'];
const POSITION_CH = { main: '本', middle: '中', residual: '余' };

const TEN_GOD_SHORT = {
  '比肩': 'Parallel', '劫财': 'Competitor',
  '食神': 'Eating God', '伤官': 'Hurting Officer',
  '正官': 'Direct Officer', '偏官': 'Seven Killings',
  '正财': 'Direct Wealth', '偏财': 'Indirect Wealth',
  '偏印': 'Indirect Resource', '正印': 'Direct Resource',
};

const STAR_DESC = {
  '天乙': 'Heavenly Noble',
  '文昌': 'Academic Star',
  '桃花': 'Peach Blossom',
  '驿马': 'Travelling Horse',
  '华盖': 'Canopy Star',
};

export default function PillarChart({ chart }) {
  const { pillars, dayMaster, specialStars } = chart;
  const starsByPillar = { Year: [], Month: [], Day: [], Hour: [] };
  specialStars.forEach(s => { if (starsByPillar[s.pillar]) starsByPillar[s.pillar].push(s); });

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {pillars.map((p, i) => {
        const isDay = i === 2;
        const se = ELEM[p.stem.element] ?? ELEM.Wood;
        const be = ELEM[p.branch.element] ?? ELEM.Wood;
        const stars = starsByPillar[p.label] ?? [];

        return (
          <div
            key={p.label}
            className="card-hover flex flex-col items-center rounded-[18px] overflow-hidden"
            style={{
              background: isDay ? `linear-gradient(160deg, ${se.bg}, #0f0f12)` : '#0f0f12',
              border: isDay ? `1px solid ${se.hex}35` : '1px solid rgba(255,255,255,0.05)',
              boxShadow: isDay ? `0 0 32px ${se.glow}` : 'none',
            }}
          >
            {/* Header */}
            <div
              className="w-full text-center py-2 px-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div
                className="text-[9px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: isDay ? se.hex : '#3a3733' }}
              >
                {PILLAR_NAMES[i]}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 w-full px-3 pt-3 pb-1">
              {/* Ten God */}
              <div className="h-5 flex items-center justify-center">
                {p.tenGod ? (
                  <span className="text-[10px] cjk" style={{ color: '#4a4844' }}
                    title={TEN_GOD_SHORT[p.tenGod.char] ?? p.tenGod.english}>
                    {p.tenGod.char}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium" style={{ color: se.hex }}>日主</span>
                )}
              </div>

              {/* Stem */}
              <div
                className="cjk select-none leading-none"
                style={{
                  fontSize: 40,
                  color: se.hex,
                  textShadow: isDay ? `0 0 20px ${se.glow}` : 'none',
                  transition: 'transform 0.2s ease',
                }}
                title={`${p.stem.pinyin} · ${p.stem.english}`}
              >
                {p.stem.char}
              </div>
              <div className="text-[9px]" style={{ color: '#3a3733' }}>{p.stem.pinyin}</div>

              <div className="w-5 my-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

              {/* Branch */}
              <div
                className="cjk select-none leading-none"
                style={{ fontSize: 40, color: be.hex }}
                title={`${p.branch.pinyin} · ${p.branch.english}`}
              >
                {p.branch.char}
              </div>
              <div className="text-[9px]" style={{ color: '#3a3733' }}>{p.branch.pinyin}</div>
            </div>

            {/* Hidden stems */}
            <div
              className="w-full px-2 py-2 mt-auto"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="text-[8px] text-center mb-1 cjk" style={{ color: '#2e2c2a' }}>藏干</div>
              {p.hiddenStems.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {p.hiddenStems.map((hs, j) => {
                    const hse = ELEM[hs.stem.element] ?? ELEM.Wood;
                    return (
                      <div key={j} className="flex items-center justify-between px-1">
                        <span className="cjk text-xs" style={{ color: hse.hex }}>{hs.stem.char}</span>
                        <span className="text-[8px]" style={{ color: '#2e2c2a' }}>{POSITION_CH[hs.position]}</span>
                        {hs.tenGod && (
                          <span className="cjk text-[9px]" style={{ color: '#3a3733' }}>{hs.tenGod.char}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-[10px]" style={{ color: '#2e2c2a' }}>—</div>
              )}
            </div>

            {/* Stars */}
            {stars.length > 0 && (
              <div
                className="w-full px-2 py-2 flex flex-wrap gap-1 justify-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                {stars.map((s, j) => (
                  <span
                    key={j}
                    className="cjk text-[9px] px-1.5 py-0.5 rounded-sm"
                    style={{ background: 'rgba(196,145,58,0.1)', color: '#c4913a', border: '1px solid rgba(196,145,58,0.2)' }}
                    title={STAR_DESC[s.star] ?? s.english}
                  >
                    {s.star}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
