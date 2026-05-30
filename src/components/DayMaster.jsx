import { ELEM } from '../bazi/constants.js';

const STEM_DESC = {
  '甲': 'Vision-led and principled — growth-oriented with a clear inner sense of direction.',
  '乙': 'Adaptive and perceptive — navigates through flexibility more than through force.',
  '丙': 'Outgoing and expressive — naturally warm, high-energy, and sociable.',
  '丁': 'Patient and focused — quietly persistent with carefully held intentions.',
  '戊': 'Steadfast and grounding — a reliable presence that provides practical stability.',
  '己': 'Nurturing and observant — attuned to others and quietly influential.',
  '庚': 'Decisive and resilient — clear standards, maintained through consistent discipline.',
  '辛': 'Refined and discerning — high aesthetic sensitivity, drawn toward quality.',
  '壬': 'Strategic and far-sighted — resourceful and comfortable with complexity.',
  '癸': 'Intuitive and reflective — deeply perceptive, absorbs environment keenly.',
};

export default function DayMaster({ dayMaster, dayPillar }) {
  const stem = dayMaster.stem;
  const branch = dayPillar?.branch;
  const e = ELEM[stem.element] ?? ELEM.Wood;
  const polarity = stem.polarity === 'yang' ? 'Yang 阳' : 'Yin 阴';
  const desc = STEM_DESC[stem.char] ?? '';

  return (
    <div
      className="card-hover rounded-[24px] p-8 sm:p-10 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${e.bg} 0%, rgba(15,15,18,0.0) 60%), #0f0f12`,
        border: `1px solid ${e.glow}`,
        boxShadow: `0 0 60px ${e.glow}, 0 4px 32px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Rim light top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${e.hex}40, transparent)` }}
      />

      <div className="flex items-start gap-8 sm:gap-12">
        {/* Large character */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            className="cjk select-none"
            style={{
              fontSize: 88,
              lineHeight: 1,
              color: e.hex,
              textShadow: `0 0 40px ${e.glow}, 0 0 80px ${e.glow}`,
              fontWeight: 500,
            }}
          >
            {stem.char}
          </div>
          {branch && (
            <div
              className="cjk select-none"
              style={{
                fontSize: 36,
                lineHeight: 1,
                color: ELEM[branch.element]?.hex ?? '#5a5754',
                opacity: 0.7,
                fontWeight: 400,
              }}
            >
              {branch.char}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 pt-1">
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: '#3a3733' }}>
            Day Master · 命主
          </div>

          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-2xl font-medium" style={{ color: '#e8e4dd' }}>
              {stem.pinyin}
            </span>
            <span className="text-base" style={{ color: e.hex }}>
              {stem.english}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: e.bg, color: e.hex, border: `1px solid ${e.hex}30` }}
            >
              {stem.element}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {polarity}
            </span>
            {branch && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                · {branch.english} Branch ({branch.char})
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, marginTop: 12, letterSpacing: '0.04em' }}>
            Yang is outward and active · Yin is inward and adaptive
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontStyle: 'italic', fontWeight: 300, color: 'var(--text-dim)', marginBottom: 8 }}>
            Your nature
          </div>
          <p className="text-[15px] leading-relaxed" style={{ color: '#9a9590' }}>
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
