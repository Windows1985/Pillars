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

const BRANCH_TYPE_EN = {
  '六合': 'Six Harmony', '三合': 'Three Harmony', '半合': 'Half Harmony',
  '六冲': 'Six Clash', '相害': 'Six Harm', '六破': 'Six Break',
  '持势刑': 'Dominant Punishment', '无礼刑': 'Ungrateful Punishment',
  '无恩刑': 'Unkind Punishment', '自刑': 'Self Punishment',
  '天干合': 'Stem Combination',
};

function Tag({ name, type, typeEnglish, effect, pillars, element, combinedElement, transforms }) {
  const s = BRANCH_STYLE[type] ?? { color: 'var(--text-muted)', bg: 'rgba(90,87,84,0.07)', border: 'rgba(90,87,84,0.2)' };
  const pillarsStr = pillars?.join(' · ');
  const typeLabel = BRANCH_TYPE_EN[type] ?? typeEnglish ?? type;

  return (
    <div
      style={{
        display: 'inline-flex', flexDirection: 'column', gap: 4,
        padding: '10px 14px', cursor: 'help',
        background: s.bg, border: `1px solid ${s.border}`,
        borderRadius: 4, transition: 'background 0.12s',
      }}
      title={`${typeLabel}\n${effect ?? ''}${pillarsStr ? `\nPillars: ${pillarsStr}` : ''}`}
      onMouseEnter={e => { e.currentTarget.style.background = s.bg.replace('0.07', '0.12').replace('0.05', '0.10').replace('0.06', '0.10'); }}
      onMouseLeave={e => { e.currentTarget.style.background = s.bg; }}
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
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            · unrealized <span style={{ fontFamily: 'var(--font-cjk)' }}>未化</span>
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
        {typeLabel}{pillarsStr ? ` · ${pillarsStr}` : ''}
      </div>
      {effect && (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: 240, marginTop: 2 }}>
          {effect}
        </div>
      )}
    </div>
  );
}

export default function Interactions({ branchInteractions = [], stemCombinations = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <p style={{
        fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic',
        fontSize: 14, color: 'var(--text-dim)', marginBottom: 16, lineHeight: 1.65,
      }}>
        Some character pairs in your chart interact — harmonies reinforce each other, tensions create friction that sharpens or disrupts. Green indicates harmony; red and amber indicate challenge.
      </p>
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
            Earthly Branch Interactions <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>地支</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {branchInteractions.map((ia, i) => <Tag key={i} {...ia} />)}
          </div>
        </div>
      )}
    </div>
  );
}
