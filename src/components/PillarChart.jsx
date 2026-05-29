import { useState } from 'react';
import { ELEM } from '../bazi/constants.js';

const PILLAR_LABELS = [
  { en: 'Year', zh: '年' },
  { en: 'Month', zh: '月' },
  { en: 'Day', zh: '日' },
  { en: 'Hour', zh: '时' },
];

const TEN_GOD_EN = {
  '比肩': 'Parallel', '劫财': 'Competitor',
  '食神': 'Eating God', '伤官': 'Hurting Officer',
  '正官': 'Direct Officer', '偏官': 'Seven Killings',
  '正财': 'Direct Wealth', '偏财': 'Indirect Wealth',
  '偏印': 'Indirect Resource', '正印': 'Direct Resource',
};

export default function PillarChart({ chart }) {
  const { pillars, specialStars } = chart;
  const [hovered, setHovered] = useState(null);

  const starsByPillar = { Year: [], Month: [], Day: [], Hour: [] };
  specialStars.forEach(s => { if (starsByPillar[s.pillar]) starsByPillar[s.pillar].push(s); });

  const ELEM_LEGEND = [
    { name: 'Wood', hex: '#6abf7a' }, { name: 'Fire', hex: '#d96b54' },
    { name: 'Earth', hex: '#c4913a' }, { name: 'Metal', hex: '#9db0c2' }, { name: 'Water', hex: '#5592b8' },
  ];

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12 }}>
        Heavenly Stem (天干) above · Earthly Branch (地支) below
      </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {pillars.map((p, i) => {
        const isDay = i === 2;
        const isHov = hovered === i;
        const se = ELEM[p.stem.element] ?? ELEM.Wood;
        const be = ELEM[p.branch.element] ?? ELEM.Wood;
        const stars = starsByPillar[p.label] ?? [];

        return (
          <div
            key={p.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', flexDirection: 'column',
              borderLeft: i === 0 ? '1px solid var(--border)' : 'none',
              borderRight: '1px solid var(--border)',
              borderTop: `1px solid ${isDay || isHov ? 'var(--jade-dim)' : 'var(--border)'}`,
              borderBottom: '1px solid var(--border)',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Pillar name */}
            <div style={{
              padding: '12px 20px 10px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'baseline', gap: 8,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: isDay ? 'var(--jade)' : 'var(--text-muted)',
              }}>
                {PILLAR_LABELS[i].en}
              </span>
              <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 12, color: 'var(--text-muted)' }}>
                {PILLAR_LABELS[i].zh}
              </span>
            </div>

            {/* Ten God */}
            <div style={{ padding: '14px 20px 0', minHeight: 26 }}>
              {isDay ? (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--jade)',
                }}>
                  日主 Day Master
                </span>
              ) : p.tenGod ? (
                <span
                  style={{ fontFamily: 'var(--font-cjk)', fontSize: 11, color: 'var(--text-muted)' }}
                  title={TEN_GOD_EN[p.tenGod.char]}
                >
                  {p.tenGod.char}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, marginLeft: 6, letterSpacing: '0.1em' }}>
                    {TEN_GOD_EN[p.tenGod.char] ?? p.tenGod.english}
                  </span>
                </span>
              ) : null}
            </div>

            {/* Stem */}
            <div style={{ padding: '8px 20px 0' }}>
              <div style={{
                fontFamily: 'var(--font-cjk)', fontSize: 72, lineHeight: 1,
                color: isDay ? 'var(--text)' : se.hex,
              }}>
                {p.stem.char}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.08em' }}>
                {p.stem.pinyin} · {p.stem.english}
              </div>
            </div>

            {/* Separator */}
            <div style={{ margin: '16px 20px', height: 1, background: 'var(--border)', flexShrink: 0 }} />

            {/* Branch */}
            <div style={{ padding: '0 20px' }}>
              <div style={{
                fontFamily: 'var(--font-cjk)', fontSize: 72, lineHeight: 1,
                color: be.hex,
              }}>
                {p.branch.char}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.08em' }}>
                {p.branch.pinyin} · {p.branch.english}
              </div>
            </div>

            {/* Hidden stems */}
            <div style={{
              marginTop: 'auto', padding: '16px 20px 16px',
              borderTop: '1px solid var(--border)',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8,
              }}>
                藏干 Hidden
              </div>
              {p.hiddenStems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {p.hiddenStems.map((hs, j) => {
                    const hse = ELEM[hs.stem.element] ?? ELEM.Wood;
                    return (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 16, lineHeight: 1, color: hse.hex }}>
                          {hs.stem.char}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                          {hs.stem.pinyin}
                        </span>
                        {hs.tenGod && (
                          <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 9, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {hs.tenGod.char}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>—</span>
              )}
            </div>

            {/* Special stars */}
            {stars.length > 0 && (
              <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {stars.map((s, j) => (
                  <span key={j} title={s.english || s.star} style={{
                    fontFamily: 'var(--font-cjk)', fontSize: 9, padding: '2px 7px',
                    background: 'rgba(196,145,58,0.08)', color: '#c4913a',
                    border: '1px solid rgba(196,145,58,0.2)',
                    letterSpacing: '0.04em', cursor: 'default',
                  }}>
                    {s.star}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 16 }}>
      {ELEM_LEGEND.map(el => (
        <div key={el.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: el.hex, flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{el.name}</span>
        </div>
      ))}
    </div>
    </div>
  );
}
