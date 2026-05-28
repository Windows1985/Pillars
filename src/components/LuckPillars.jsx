import { STEMS, BRANCHES, ELEMENT_COLORS } from '../bazi/constants.js';

export default function LuckPillars({ luckPillars, birthYear, currentYear }) {
  const { forward, startingAge, pillars } = luckPillars;
  const age = currentYear - birthYear;

  function isCurrentPillar(p) {
    return age >= p.startAge && age <= p.endAge;
  }

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-medium text-neutral-300">Luck Pillars 大运</h2>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span>Starts age <span className="text-neutral-300">{startingAge}</span></span>
          <span>{forward ? 'Forward →' : '← Backward'}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {pillars.map((p, i) => {
            const current = isCurrentPillar(p);
            const stem = STEMS[p.stemIdx];
            const branch = BRANCHES[p.branchIdx];
            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded border ${
                  current
                    ? 'border-gold-400 bg-neutral-700'
                    : 'border-neutral-700 bg-neutral-800'
                }`}
              >
                <div className={`font-serif text-xl ${ELEMENT_COLORS[stem.element]}`} title={stem.pinyin}>
                  {stem.char}
                </div>
                <div className={`font-serif text-xl ${ELEMENT_COLORS[branch.element]}`} title={branch.pinyin}>
                  {branch.char}
                </div>
                <div className="text-[10px] text-neutral-500 text-center leading-tight">
                  {p.startAge}–{p.endAge}
                </div>
                {current && (
                  <div className="text-[9px] text-gold-400">now</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
