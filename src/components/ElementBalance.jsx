import { ELEMENTS, ELEMENT_COLORS, ELEMENT_BG } from '../bazi/constants.js';

export default function ElementBalance({ balance, dayMaster }) {
  const { totals, total, strong, usefulGod } = balance;
  const dmElement = dayMaster.stem.element;

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-300">Element Balance 五行</h2>
        <span className={`text-xs px-2 py-0.5 rounded border ${
          strong
            ? 'border-gold-400 text-gold-400'
            : 'border-neutral-500 text-neutral-400'
        }`}>
          Day Master {strong ? 'Strong 旺' : 'Weak 弱'}
        </span>
      </div>

      <div className="space-y-2">
        {ELEMENTS.map(el => {
          const score = totals[el] ?? 0;
          const pct = total > 0 ? (score / total) * 100 : 0;
          const isDM = el === dmElement;
          return (
            <div key={el} className="flex items-center gap-2">
              <div className={`text-xs w-12 text-right ${ELEMENT_COLORS[el]} ${isDM ? 'font-medium' : ''}`}>
                {el}
              </div>
              <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${ELEMENT_BG[el]} ${isDM ? 'opacity-100' : 'opacity-60'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs text-neutral-500 w-8 text-right">
                {score.toFixed(1)}
              </div>
              {isDM && <div className="text-[10px] text-gold-400 w-3">★</div>}
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-neutral-700">
        <div className="text-xs text-neutral-400">
          Useful God 用神:{' '}
          <span className={`font-medium ${ELEMENT_COLORS[usefulGod.primaryElement]}`}>
            {usefulGod.primaryElement}
          </span>
          {' '}
          <span className="text-neutral-500">
            ({strong ? 'controls / drains Day Master' : 'produces / supports Day Master'})
          </span>
        </div>
      </div>
    </div>
  );
}
