import { ELEMENT_COLORS } from '../bazi/constants.js';

const PILLAR_LABELS = [
  { en: 'Year', zh: '年', desc: 'Your ancestral roots, early life, and relationship with society at large.' },
  { en: 'Month', zh: '月', desc: 'Career, parents, and the environment you grew up in. The most influential pillar.' },
  { en: 'Day', zh: '日', desc: 'Your core self and your closest relationships. The top stem is your Day Master — the lens through which everything else is read.' },
  { en: 'Hour', zh: '时', desc: 'Children, later life, hidden desires, and your inner world.' },
];

const TEN_GOD_DESCRIPTIONS = {
  '比肩': 'Parallel — same energy as you. Independent, self-reliant.',
  '劫财': 'Competitor — rivals your resources. Competitive drive.',
  '食神': 'Eating God — what you produce with ease. Talent, enjoyment.',
  '伤官': 'Hurting Officer — expressive, unconventional output. Creativity.',
  '正官': 'Direct Officer — structure and responsibility. Career, rules.',
  '偏官': 'Seven Killings — pressure that builds strength. Challenges.',
  '正财': 'Direct Wealth — earned through discipline. Stable income.',
  '偏财': 'Indirect Wealth — windfall, opportunity. Speculation.',
  '偏印': 'Indirect Resource — non-traditional support. Unconventional help.',
  '正印': 'Direct Resource — nurturing support. Mentors, knowledge.',
};

const POSITION_LABEL = { main: '本', middle: '中', residual: '余' };
const POSITION_TITLE = {
  main: 'Main energy (本气) — strongest hidden influence, weight 0.6',
  middle: 'Middle energy (中气) — moderate hidden influence, weight 0.3',
  residual: 'Residual energy (余气) — faint hidden influence, weight 0.1',
};

const INTERACTION_INFO = {
  '六合': { color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/50' },
  '三合': { color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/50' },
  '半合': { color: 'text-emerald-300', bg: 'bg-emerald-950/30', border: 'border-emerald-900/50' },
  '六冲': { color: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-800/50' },
  '相害': { color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-800/50' },
  '六破': { color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/50' },
  '天干合': { color: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-800/50' },
  '持势刑': { color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/50' },
  '无礼刑': { color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/50' },
  '无恩刑': { color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/50' },
  '自刑': { color: 'text-red-300', bg: 'bg-red-950/30', border: 'border-red-900/50' },
};

function getInteractionStyle(type) {
  return INTERACTION_INFO[type] ?? { color: 'text-[#5a5754]', bg: 'bg-[#1a1a1e]', border: 'border-[#2a2a2e]' };
}

const STAR_DESCRIPTIONS = {
  '天乙': 'Heavenly Noble Star — a powerful benefactor star. Suggests help arrives at critical moments.',
  '文昌': 'Academic Star — intelligence and scholarly ability. Supports learning and writing.',
  '桃花': 'Peach Blossom — charm and magnetism. Attracts people naturally.',
  '驿马': 'Travelling Horse — movement and change. Travel, relocation, active career.',
  '华盖': 'Canopy Star — independent thinking, artistic gifts, and a tendency toward solitude or spirituality.',
};

function StarBadge({ star }) {
  const desc = STAR_DESCRIPTIONS[star.star] ?? star.english;
  return (
    <span
      title={`${star.star} ${star.pinyin}\n${desc}`}
      className="inline-block text-[10px] px-1.5 py-0.5 rounded-sm border cursor-default select-none"
      style={{ background: 'rgba(196,145,58,0.08)', borderColor: 'rgba(196,145,58,0.25)', color: '#c4913a' }}
    >
      {star.star} {star.pinyin}
    </span>
  );
}

function HiddenStemRow({ hs }) {
  return (
    <div
      className="flex items-center gap-1.5 py-0.5"
      title={`${hs.stem.char} ${hs.stem.pinyin} (${hs.stem.english}) — ${POSITION_TITLE[hs.position]}`}
    >
      <span className={`text-xs font-medium ${ELEMENT_COLORS[hs.stem.element]}`}>{hs.stem.char}</span>
      <span className="text-[10px]" style={{ color: '#3d3a37' }}>{POSITION_LABEL[hs.position]}</span>
      {hs.tenGod && (
        <span
          className="text-[10px] ml-auto"
          style={{ color: '#5a5754' }}
          title={TEN_GOD_DESCRIPTIONS[hs.tenGod.char] ?? hs.tenGod.english}
        >
          {hs.tenGod.char}
        </span>
      )}
    </div>
  );
}

function InteractionTag({ ia }) {
  const style = getInteractionStyle(ia.type);
  const pillarsStr = ia.pillars?.join(' · ');
  return (
    <div
      className={`text-xs px-2.5 py-1.5 rounded border ${style.bg} ${style.border} cursor-default`}
      title={`${ia.typeEnglish}\n${ia.effect}\nPillars: ${pillarsStr}`}
    >
      <span className={`font-medium ${style.color}`}>{ia.name}</span>
      <span className="ml-1.5" style={{ color: '#5a5754' }}>{ia.typeEnglish}</span>
      {ia.element && <span className="ml-1" style={{ color: '#3d3a37' }}>→ {ia.element}</span>}
    </div>
  );
}

function SectionLabel({ children, tooltip }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-medium tracking-wide" style={{ color: '#5a5754' }}>{children}</span>
      {tooltip && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-sm border cursor-help"
          style={{ borderColor: '#2a2a2e', color: '#3d3a37' }}
          title={tooltip}
        >
          ?
        </span>
      )}
    </div>
  );
}

export default function PillarChart({ chart }) {
  const { pillars, dayMaster, specialStars, branchInteractions, stemCombinations } = chart;

  const starsByPillar = { Year: [], Month: [], Day: [], Hour: [] };
  specialStars.forEach(s => { if (starsByPillar[s.pillar]) starsByPillar[s.pillar].push(s); });

  const hasInteractions = branchInteractions?.length > 0;
  const hasStemCombos = stemCombinations?.length > 0;

  return (
    <div className="space-y-6">

      {/* Section header */}
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <h2 className="text-base font-medium" style={{ color: '#ece8e1' }}>Four Pillars</h2>
          <span className="text-sm font-serif" style={{ color: '#3d3a37' }}>四柱命盘</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#5a5754' }}>
          Your birth date and time produce four pillars, each a pair of characters. The upper character is a Heavenly Stem (天干), representing active energy. The lower is an Earthly Branch (地支), containing hidden influences called Hidden Stems (藏干).
        </p>
      </div>

      {/* Day master callout */}
      <div
        className="flex items-start gap-3 rounded-lg px-4 py-3"
        style={{ background: 'rgba(196,145,58,0.06)', border: '1px solid rgba(196,145,58,0.15)' }}
      >
        <div className={`font-serif text-2xl leading-none ${ELEMENT_COLORS[dayMaster.stem.element]}`}>
          {dayMaster.stem.char}
        </div>
        <div>
          <div className="text-xs font-medium mb-0.5" style={{ color: '#ece8e1' }}>
            Day Master · {dayMaster.stem.pinyin} · {dayMaster.stem.english} {dayMaster.stem.element}
          </div>
          <div className="text-xs leading-relaxed" style={{ color: '#5a5754' }}>
            Your Day Master is the top character of the Day pillar — it defines your core nature and the perspective from which all other elements are interpreted. Every other stem is understood relative to this one.
          </div>
        </div>
      </div>

      {/* Pillar grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {pillars.map((p, i) => {
          const meta = PILLAR_LABELS[i];
          const isDay = i === 2;
          return (
            <div
              key={p.label}
              className="rounded-lg flex flex-col items-center gap-0 overflow-hidden"
              style={{
                border: isDay ? '1px solid rgba(196,145,58,0.4)' : '1px solid #1e1e22',
                background: isDay ? 'rgba(196,145,58,0.04)' : '#131316',
              }}
            >
              {/* Pillar header */}
              <div
                className="w-full text-center py-2 px-2"
                style={{ borderBottom: '1px solid #1a1a1e' }}
                title={meta.desc}
              >
                <div className="text-[9px] uppercase tracking-widest font-medium" style={{ color: isDay ? '#c4913a' : '#3d3a37' }}>
                  {meta.en}
                </div>
                <div className="text-[10px] font-serif" style={{ color: '#3d3a37' }}>{meta.zh}</div>
              </div>

              <div className="flex flex-col items-center gap-1 px-2 pt-3 pb-1 w-full">
                {/* Ten God */}
                <div className="h-5 flex items-center justify-center">
                  {p.tenGod ? (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-sm"
                      style={{ background: '#1a1a1e', color: '#5a5754' }}
                      title={TEN_GOD_DESCRIPTIONS[p.tenGod.char] ?? p.tenGod.english}
                    >
                      {p.tenGod.char} {p.tenGod.pinyin}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium" style={{ color: '#c4913a' }}>日主 Day Master</span>
                  )}
                </div>

                {/* Stem */}
                <div
                  className={`font-serif text-3xl sm:text-4xl font-medium leading-none ${ELEMENT_COLORS[p.stem.element]}`}
                  title={`${p.stem.char} · ${p.stem.pinyin} · ${p.stem.english} · ${p.stem.element}`}
                >
                  {p.stem.char}
                </div>
                <div className="text-[9px]" style={{ color: '#3d3a37' }}>{p.stem.pinyin} · {p.stem.element}</div>

                {/* Divider */}
                <div className="w-6 my-1" style={{ height: 1, background: '#1e1e22' }} />

                {/* Branch */}
                <div
                  className={`font-serif text-3xl sm:text-4xl font-medium leading-none ${ELEMENT_COLORS[p.branch.element]}`}
                  title={`${p.branch.char} · ${p.branch.pinyin} · ${p.branch.english} · ${p.branch.element}`}
                >
                  {p.branch.char}
                </div>
                <div className="text-[9px]" style={{ color: '#3d3a37' }}>{p.branch.pinyin} · {p.branch.element}</div>
              </div>

              {/* Hidden stems */}
              <div
                className="w-full px-2 py-2 mt-1"
                style={{ borderTop: '1px solid #1a1a1e' }}
                title="Hidden Stems (藏干) — energies concealed within the Branch. They influence quietly from below the surface."
              >
                <div className="text-[9px] mb-1 text-center" style={{ color: '#3d3a37' }}>藏干 Hidden</div>
                {p.hiddenStems.length > 0 ? (
                  p.hiddenStems.map((hs, j) => <HiddenStemRow key={j} hs={hs} />)
                ) : (
                  <div className="text-[10px] text-center" style={{ color: '#3d3a37' }}>—</div>
                )}
              </div>

              {/* Stars */}
              {starsByPillar[p.label].length > 0 && (
                <div
                  className="w-full px-2 py-2 flex flex-wrap gap-1 justify-center"
                  style={{ borderTop: '1px solid #1a1a1e' }}
                >
                  {starsByPillar[p.label].map((s, j) => (
                    <StarBadge key={j} star={s} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactions */}
      {(hasInteractions || hasStemCombos) && (
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <h3 className="text-sm font-medium" style={{ color: '#ece8e1' }}>Interactions</h3>
              <span className="text-sm font-serif" style={{ color: '#3d3a37' }}>干支关系</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#5a5754' }}>
              When two or more characters in your chart share a special relationship, they interact — either strengthening each other (combinations), opposing each other (clashes), or creating tension (punishments, harms). These dynamics shape how your chart's energy flows.
            </p>
          </div>

          {hasStemCombos && (
            <div>
              <SectionLabel tooltip="Five Stem Combinations (五合): adjacent stems merge their energies. Transformation into the combined element requires seasonal support and is not confirmed here.">
                Stem Combinations 天干合
              </SectionLabel>
              <div className="flex flex-wrap gap-2">
                {stemCombinations.map((sc, i) => (
                  <div
                    key={i}
                    className="text-xs px-2.5 py-1.5 rounded border cursor-default"
                    style={{ background: 'rgba(14,116,144,0.08)', borderColor: 'rgba(14,116,144,0.2)' }}
                    title={`${sc.effect}\nPillars: ${sc.pillars?.join(' · ')}`}
                  >
                    <span className="font-medium" style={{ color: '#67e8f9' }}>{sc.name}</span>
                    <span className="ml-1.5" style={{ color: '#5a5754' }}>→ {sc.combinedElement}</span>
                    <span className="ml-1 text-[10px]" style={{ color: '#3d3a37' }}>(未化 not transformed)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasInteractions && (
            <div>
              <SectionLabel tooltip="Relationships between the four Earthly Branches. Combinations (合) are harmonious; clashes (冲) are disruptive; punishments (刑) create internal pressure.">
                Branch Interactions 地支
              </SectionLabel>
              <div className="flex flex-wrap gap-2">
                {branchInteractions.map((ia, i) => (
                  <InteractionTag key={i} ia={ia} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
