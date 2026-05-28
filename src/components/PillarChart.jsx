import { ELEMENT_COLORS } from '../bazi/constants.js';

const PILLAR_LABELS = ['Year 年', 'Month 月', 'Day 日', 'Hour 时'];

function StarBadge({ star }) {
  return (
    <span
      title={`${star.star} ${star.pinyin} — ${star.english}`}
      className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-gold-400 border border-neutral-600"
    >
      {star.star}
    </span>
  );
}

function HiddenStemRow({ hs }) {
  return (
    <div className="flex items-center gap-1 text-xs text-neutral-400">
      <span className={`${ELEMENT_COLORS[hs.stem.element]} font-medium`}>{hs.stem.char}</span>
      <span className="text-neutral-600 text-[10px]">
        {hs.position === 'main' ? '本' : hs.position === 'middle' ? '中' : '余'}
      </span>
      {hs.tenGod && (
        <span className="text-neutral-500 text-[10px]">{hs.tenGod.char}</span>
      )}
    </div>
  );
}

function InteractionTag({ ia }) {
  return (
    <div
      className="text-xs px-2 py-1 rounded bg-neutral-800 border border-neutral-700"
      title={`${ia.typeEnglish}: ${ia.effect}`}
    >
      <span className="text-neutral-300">{ia.name}</span>
      <span className="text-neutral-500 ml-1">{ia.typePinyin}</span>
      {ia.element && <span className="text-neutral-500 ml-1">→ {ia.element}</span>}
    </div>
  );
}

export default function PillarChart({ chart, stemCombinations }) {
  const { pillars, dayMaster, specialStars, branchInteractions } = chart;

  const starsByPillar = { Year: [], Month: [], Day: [], Hour: [] };
  specialStars.forEach(s => { if (starsByPillar[s.pillar]) starsByPillar[s.pillar].push(s); });

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <h2 className="text-sm font-medium text-neutral-300">Four Pillars 四柱</h2>
        <span className="text-xs text-neutral-500">
          Day Master:{' '}
          <span className={`font-medium ${ELEMENT_COLORS[dayMaster.stem.element]}`}>
            {dayMaster.stem.char} {dayMaster.stem.pinyin} — {dayMaster.stem.english}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {pillars.map((p, i) => (
          <div
            key={p.label}
            className={`rounded-lg border p-3 sm:p-4 flex flex-col items-center gap-2 ${
              i === 2
                ? 'border-gold-400 bg-neutral-800'
                : 'border-neutral-700 bg-neutral-800/50'
            }`}
          >
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              {PILLAR_LABELS[i]}
            </div>

            <div className="h-4 flex items-center">
              {p.tenGod ? (
                <span className="text-[11px] text-neutral-400" title={`${p.tenGod.pinyin} — ${p.tenGod.english}`}>
                  {p.tenGod.char}
                </span>
              ) : (
                <span className="text-[11px] text-gold-400">日主</span>
              )}
            </div>

            <div
              className={`font-serif text-3xl sm:text-4xl font-medium ${ELEMENT_COLORS[p.stem.element]}`}
              title={`${p.stem.pinyin} — ${p.stem.english}`}
            >
              {p.stem.char}
            </div>
            <div className="text-[10px] text-neutral-500">{p.stem.pinyin}</div>

            <div className="w-8 h-px bg-neutral-700" />

            <div
              className={`font-serif text-3xl sm:text-4xl font-medium ${ELEMENT_COLORS[p.branch.element]}`}
              title={`${p.branch.pinyin} — ${p.branch.english}`}
            >
              {p.branch.char}
            </div>
            <div className="text-[10px] text-neutral-500">{p.branch.pinyin}</div>

            <div className="w-full space-y-0.5 min-h-[3rem]">
              {p.hiddenStems.map((hs, j) => (
                <HiddenStemRow key={j} hs={hs} />
              ))}
            </div>

            {starsByPillar[p.label].length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {starsByPillar[p.label].map((s, j) => (
                  <StarBadge key={j} star={s} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stem combinations 天干合 */}
      {stemCombinations?.length > 0 && (
        <div>
          <div className="text-xs text-neutral-500 mb-2">Stem Combinations 天干合</div>
          <div className="flex flex-wrap gap-2">
            {stemCombinations.map((sc, i) => (
              <div
                key={i}
                className="text-xs px-2 py-1 rounded bg-neutral-800 border border-neutral-700"
                title={sc.effect}
              >
                <span className="text-neutral-300">{sc.name}</span>
                <span className="text-neutral-500 ml-1">→ {sc.combinedElement}</span>
                <span className="text-neutral-600 ml-1 text-[10px]">(未化)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branch interactions */}
      {branchInteractions?.length > 0 && (
        <div>
          <div className="text-xs text-neutral-500 mb-2">Branch Interactions 地支</div>
          <div className="flex flex-wrap gap-2">
            {branchInteractions.map((ia, i) => (
              <InteractionTag key={i} ia={ia} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
