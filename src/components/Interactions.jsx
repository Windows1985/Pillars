const BRANCH_STYLE = {
  '六合':   { color: '#6abf7a', bg: 'rgba(106,191,122,0.07)', border: 'rgba(106,191,122,0.2)'  },
  '三合':   { color: '#6abf7a', bg: 'rgba(106,191,122,0.07)', border: 'rgba(106,191,122,0.2)'  },
  '半合':   { color: '#7ac98a', bg: 'rgba(106,191,122,0.05)', border: 'rgba(106,191,122,0.15)' },
  '六冲':   { color: '#d96b54', bg: 'rgba(217,107,84,0.07)',  border: 'rgba(217,107,84,0.2)'   },
  '相害':   { color: '#c4913a', bg: 'rgba(196,145,58,0.07)',  border: 'rgba(196,145,58,0.2)'   },
  '六破':   { color: '#b8883a', bg: 'rgba(184,136,58,0.06)',  border: 'rgba(184,136,58,0.18)'  },
  '持势刑': { color: '#d96b54', bg: 'rgba(217,107,84,0.07)',  border: 'rgba(217,107,84,0.2)'   },
  '无礼刑': { color: '#d96b54', bg: 'rgba(217,107,84,0.07)',  border: 'rgba(217,107,84,0.2)'   },
  '无恩刑': { color: '#d96b54', bg: 'rgba(217,107,84,0.07)',  border: 'rgba(217,107,84,0.2)'   },
  '自刑':   { color: '#c07060', bg: 'rgba(192,112,96,0.06)',  border: 'rgba(192,112,96,0.18)'  },
};

function Tag({ name, type, typeEnglish, effect, pillars, element, combinedElement, transforms }) {
  const s = BRANCH_STYLE[type] ?? { color: 'var(--text-muted)', bg: 'rgba(90,87,84,0.07)', border: 'rgba(90,87,84,0.2)' };
  const pillarsStr = pillars?.join(' · ');

  return (
    <div
      style={{
        display: 'inline-flex', flexDirection: 'column', gap: 4,
        padding: '8px 14px', cursor: 'default',
        background: s.bg, border: `1px solid ${s.border}`,
      }}
      title={`${typeEnglish}\n${effect}${pillarsStr ? `\nPillars: ${pillarsStr}` : ''}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 14, fontWeight: 500, color: s.color }}>
          {name}
        </span>
        {(element || combinedElement) && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            → {element ?? combinedElement}
          </span>
        )}
        {type === '天干合' && !transforms && (
          <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 9, color: 'var(--text-muted)' }}>未化</span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
        {typeEnglish}{pillarsStr ? ` · ${pillarsStr}` : ''}
      </div>
    </div>
  );
}

export default function Interactions({ branchInteractions = [], stemCombinations = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {stemCombinations.length > 0 && (
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16,
          }}>
            Stem Combinations · 天干合
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {stemCombinations.map((sc, i) => <Tag key={i} {...sc} type="天干合" />)}
          </div>
        </div>
      )}

      {branchInteractions.length > 0 && (
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16,
          }}>
            Branch Interactions · 地支
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {branchInteractions.map((ia, i) => <Tag key={i} {...ia} />)}
          </div>
        </div>
      )}
    </div>
  );
}
