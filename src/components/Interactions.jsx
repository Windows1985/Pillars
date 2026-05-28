const BRANCH_STYLE = {
  '六合':  { color: '#6abf7a', bg: 'rgba(106,191,122,0.07)', border: 'rgba(106,191,122,0.2)'  },
  '三合':  { color: '#6abf7a', bg: 'rgba(106,191,122,0.07)', border: 'rgba(106,191,122,0.2)'  },
  '半合':  { color: '#7ac98a', bg: 'rgba(106,191,122,0.05)', border: 'rgba(106,191,122,0.15)' },
  '六冲':  { color: '#d96b54', bg: 'rgba(217,107,84,0.07)',  border: 'rgba(217,107,84,0.2)'   },
  '相害':  { color: '#c4913a', bg: 'rgba(196,145,58,0.07)',  border: 'rgba(196,145,58,0.2)'   },
  '六破':  { color: '#b8883a', bg: 'rgba(184,136,58,0.06)',  border: 'rgba(184,136,58,0.18)'  },
  '持势刑': { color: '#d96b54', bg: 'rgba(217,107,84,0.07)', border: 'rgba(217,107,84,0.2)'   },
  '无礼刑': { color: '#d96b54', bg: 'rgba(217,107,84,0.07)', border: 'rgba(217,107,84,0.2)'   },
  '无恩刑': { color: '#d96b54', bg: 'rgba(217,107,84,0.07)', border: 'rgba(217,107,84,0.2)'   },
  '自刑':   { color: '#c07060', bg: 'rgba(192,112,96,0.06)', border: 'rgba(192,112,96,0.18)'  },
};

function Tag({ name, type, typeEnglish, effect, pillars, element, combinedElement, transforms }) {
  const s = BRANCH_STYLE[type] ?? { color: '#5a5754', bg: 'rgba(90,87,84,0.07)', border: 'rgba(90,87,84,0.2)' };
  const isStem = type === '天干合';
  const pillarsStr = pillars?.join(' · ');

  return (
    <div
      className="inline-flex flex-col gap-1 px-3 py-2 rounded-[10px] cursor-default"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
      title={`${typeEnglish}\n${effect}${pillarsStr ? `\nPillars: ${pillarsStr}` : ''}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium cjk" style={{ color: s.color }}>{name}</span>
        {(element || combinedElement) && (
          <span className="text-xs" style={{ color: '#4a4844' }}>→ {element ?? combinedElement}</span>
        )}
        {isStem && !transforms && (
          <span className="text-[10px] cjk" style={{ color: '#2e2c2a' }}>未化</span>
        )}
      </div>
      <div className="text-[11px]" style={{ color: '#4a4844' }}>
        {typeEnglish}{pillarsStr ? ` · ${pillarsStr}` : ''}
      </div>
    </div>
  );
}

export default function Interactions({ branchInteractions = [], stemCombinations = [] }) {
  return (
    <div className="space-y-5">
      {stemCombinations.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: '#3a3733' }}>
            Stem Combinations 天干合
          </div>
          <div className="flex flex-wrap gap-2">
            {stemCombinations.map((sc, i) => (
              <Tag key={i} {...sc} type="天干合" />
            ))}
          </div>
        </div>
      )}

      {branchInteractions.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: '#3a3733' }}>
            Branch Interactions 地支
          </div>
          <div className="flex flex-wrap gap-2">
            {branchInteractions.map((ia, i) => (
              <Tag key={i} {...ia} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
