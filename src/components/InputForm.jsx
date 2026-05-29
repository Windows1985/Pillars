import { useState, useRef, useEffect } from 'react';

const HOUR_BLOCKS = [
  { branchIdx: 0,  char: '子', pinyin: 'Zǐ',   time: '23:00–01:00', animal: 'Rat'     },
  { branchIdx: 1,  char: '丑', pinyin: 'Chǒu', time: '01:00–03:00', animal: 'Ox'      },
  { branchIdx: 2,  char: '寅', pinyin: 'Yín',  time: '03:00–05:00', animal: 'Tiger'   },
  { branchIdx: 3,  char: '卯', pinyin: 'Mǎo',  time: '05:00–07:00', animal: 'Rabbit'  },
  { branchIdx: 4,  char: '辰', pinyin: 'Chén', time: '07:00–09:00', animal: 'Dragon'  },
  { branchIdx: 5,  char: '巳', pinyin: 'Sì',   time: '09:00–11:00', animal: 'Snake'   },
  { branchIdx: 6,  char: '午', pinyin: 'Wǔ',   time: '11:00–13:00', animal: 'Horse'   },
  { branchIdx: 7,  char: '未', pinyin: 'Wèi',  time: '13:00–15:00', animal: 'Goat'    },
  { branchIdx: 8,  char: '申', pinyin: 'Shēn', time: '15:00–17:00', animal: 'Monkey'  },
  { branchIdx: 9,  char: '酉', pinyin: 'Yǒu',  time: '17:00–19:00', animal: 'Rooster' },
  { branchIdx: 10, char: '戌', pinyin: 'Xū',   time: '19:00–21:00', animal: 'Dog'     },
  { branchIdx: 11, char: '亥', pinyin: 'Hài',  time: '21:00–23:00', animal: 'Pig'     },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

function validateYear(y) {
  const n = parseInt(y, 10);
  return !isNaN(n) && n >= 1920 && n <= 2011;
}

function Reveal({ show, focusSelector = 'input, [data-autofocus]', children }) {
  const ref = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!show) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setEntered(true);
        setTimeout(() => {
          if (!ref.current) return;
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          const el = ref.current.querySelector(focusSelector);
          if (el) el.focus({ preventScroll: true });
        }, 300);
      })
    );
    return () => cancelAnimationFrame(raf);
  }, [show]); // eslint-disable-line

  if (!show) return null;

  return (
    <div
      ref={ref}
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : 'translateY(12px)',
        transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </div>
  );
}

function Done({ label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--jade-dim)', flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

function StepCard({ n, question, context, onEnter, children }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && onEnter) {
      e.preventDefault();
      onEnter();
    }
  }
  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        borderTop: '1px solid var(--border)',
        paddingTop: 28, paddingBottom: 32,
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
        {String(n).padStart(2, '0')}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.3, marginBottom: context ? 12 : 20 }}>
        {question}
      </h2>
      {context && (
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 300, lineHeight: 1.7,
          color: 'var(--text-muted)', marginBottom: 20,
          paddingLeft: 12, borderLeft: '1px solid var(--jade-dim)',
        }}>
          {context}
        </p>
      )}
      {children}
    </div>
  );
}

function Btn({ label, onClick, disabled, large }) {
  return (
    <button
      data-autofocus
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: large ? 11 : 10,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        padding: large ? '13px 0' : '10px 20px',
        width: large ? '100%' : undefined,
        background: disabled ? 'transparent' : 'var(--jade-bg)',
        color: disabled ? 'var(--text-muted)' : 'var(--jade)',
        border: disabled ? '1px solid var(--border)' : '1px solid var(--jade-border)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'oklch(17% 0.05 162)'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = 'var(--jade-bg)'; }}
    >
      {label}{!large && ' →'}
    </button>
  );
}

function TextInput({ value, onChange, placeholder, autoFocus }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={{
        width: '100%', boxSizing: 'border-box',
        fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 300,
        background: 'transparent',
        border: 'none', borderBottom: '1px solid var(--border)',
        padding: '8px 0', color: 'var(--text)',
        outline: 'none', caretColor: 'var(--jade)',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => { e.target.style.borderBottomColor = 'var(--jade-dim)'; }}
      onBlur={e => { e.target.style.borderBottomColor = 'var(--border)'; }}
    />
  );
}

function NumberInput({ value, onChange, min, max, placeholder }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box',
        fontFamily: 'var(--font-mono)', fontSize: 18, letterSpacing: '0.06em',
        background: 'transparent',
        border: 'none', borderBottom: '1px solid var(--border)',
        padding: '8px 0', color: 'var(--text)',
        outline: 'none', caretColor: 'var(--jade)',
        appearance: 'textfield',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => { e.target.style.borderBottomColor = 'var(--jade-dim)'; }}
      onBlur={e => { e.target.style.borderBottomColor = 'var(--border)'; }}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(+e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em',
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          padding: '10px 32px 10px 12px', color: 'var(--text-dim)',
          outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none',
        fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
      }}>↓</span>
    </div>
  );
}

function TogglePair({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 1, background: 'var(--border)' }}>
      {options.map(o => (
        <button
          key={o.value}
          data-autofocus={o.value === options[0].value ? true : undefined}
          onClick={() => onChange(o.value)}
          style={{
            flex: 1, padding: '12px 0',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: value === o.value ? 'var(--jade-bg)' : 'var(--surface-1)',
            color: value === o.value ? 'var(--jade)' : 'var(--text-muted)',
            border: 'none', cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function HourGrid({ value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)' }}>
      {HOUR_BLOCKS.map(h => {
        const active = value === h.branchIdx;
        return (
          <button
            key={h.branchIdx}
            data-autofocus={h.branchIdx === 0 ? true : undefined}
            onClick={() => onChange(h.branchIdx)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: '12px 4px',
              background: active ? 'var(--jade-bg)' : 'var(--surface-1)',
              border: 'none', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontFamily: 'var(--font-cjk)', fontSize: 20, lineHeight: 1, color: active ? 'var(--text)' : 'var(--text-dim)' }}>
              {h.char}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.06em', color: active ? 'var(--jade)' : 'var(--text-muted)' }}>
              {h.pinyin}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              {h.time}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.04em', color: active ? 'var(--jade)' : 'var(--text-muted)', textTransform: 'capitalize' }}>
              {h.animal}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function InputForm({ onSubmit }) {
  const [step, setStep]             = useState(1);
  const [name, setName]             = useState('');
  const [gender, setGender]         = useState('male');
  const [year, setYear]             = useState('');
  const [month, setMonth]           = useState(1);
  const [day, setDay]               = useState(1);
  const [hourBranch, setHourBranch] = useState(0);
  const [lateZi, setLateZi]         = useState(false);

  const maxDay = daysInMonth(parseInt(year) || 2000, month);
  const safeDay = Math.min(day, maxDay);

  function advance(n) { setStep(s => Math.max(s, n + 1)); }

  function submit() {
    onSubmit({
      year: parseInt(year),
      month,
      day: safeDay,
      hourBranch,
      isLateZiHour: lateZi,
      gender,
      name: name.trim(),
    });
  }

  const selectedHour = HOUR_BLOCKS.find(h => h.branchIdx === hourBranch);
  const genderLabel = gender === 'male' ? 'Male' : 'Female';
  const dateLabel = year ? `${MONTHS[month - 1]} ${safeDay}, ${year}` : '';
  const hourLabel = selectedHour
    ? `${selectedHour.char} ${selectedHour.pinyin} · ${selectedHour.time}${lateZi ? ' (after 23:00)' : ''}`
    : '';

  return (
    <div>
      <Reveal show={step >= 1} focusSelector="input">
        {step > 1 ? (
          <Done label="Name" value={name.trim() || '—'} />
        ) : (
          <StepCard n={1} question="What's your name?" context="Optional — used only to personalise the chart header." onEnter={() => advance(1)}>
            <TextInput value={name} onChange={setName} placeholder="Your name, or leave blank" autoFocus />
            <div style={{ marginTop: 20 }}>
              <Btn label="Continue" onClick={() => advance(1)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      <Reveal show={step >= 2}>
        {step > 2 ? (
          <Done label="Sex at birth" value={genderLabel} />
        ) : (
          <StepCard n={2} question="What is your sex at birth?" context="BaZi uses biological sex to determine which direction your ten-year life cycles run — the chapters that shift the elemental balance of each decade." onEnter={() => advance(2)}>
            <TogglePair value={gender} onChange={setGender} options={[{ value: 'male', label: 'Male 男' }, { value: 'female', label: 'Female 女' }]} />
            <div style={{ marginTop: 20 }}>
              <Btn label="Continue" onClick={() => advance(2)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      <Reveal show={step >= 3} focusSelector="input">
        {step > 3 ? (
          <Done label="Birth year" value={year} />
        ) : (
          <StepCard n={3} question="What year were you born?" context="The BaZi year begins on 立春 (Lì Chūn) around February 4th, not January 1st. If you were born in January or early February, your BaZi year may be the previous calendar year. Charts are calculated for birth years 1920–2011." onEnter={() => validateYear(year) && advance(3)}>
            <NumberInput value={year} onChange={setYear} min={1920} max={2011} placeholder="e.g. 1988" />
            {year && !validateYear(year) && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#d96b54', marginTop: 8 }}>
                Enter a year between 1920 and 2011.
              </p>
            )}
            <div style={{ marginTop: 20 }}>
              <Btn label="Continue" onClick={() => advance(3)} disabled={!validateYear(year)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      <Reveal show={step >= 4}>
        {step > 4 ? (
          <Done label="Birth date" value={dateLabel} />
        ) : (
          <StepCard n={4} question="What is your birth date?" context="Your month and day set the Month Pillar — the character pair governing career and social life." onEnter={() => advance(4)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Select value={month} onChange={v => { setMonth(v); setDay(d => Math.min(d, daysInMonth(parseInt(year) || 2000, v))); }} options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))} />
              <Select value={safeDay} onChange={setDay} options={Array.from({ length: maxDay }, (_, i) => ({ value: i + 1, label: String(i + 1) }))} />
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn label="Continue" onClick={() => advance(4)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      <Reveal show={step >= 5}>
        {step > 5 ? (
          <Done label="Birth time" value={hourLabel} />
        ) : (
          <StepCard n={5} question="What time were you born?" context="Each 2-hour block is an Earthly Branch (地支). The Hour Pillar governs your inner world and close relationships." onEnter={submit}>
            <HourGrid value={hourBranch} onChange={setHourBranch} />

            {hourBranch === 0 && (
              <div style={{ marginTop: 16, padding: '16px', background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 300, color: 'var(--text-muted)', marginBottom: 12 }}>
                  子 (Zǐ) spans midnight. Which half?
                </p>
                <div style={{ display: 'flex', gap: 1, background: 'var(--border)' }}>
                  {[
                    { id: false, label: '00:00–01:00', sub: 'Early Zǐ · this calendar day' },
                    { id: true,  label: '23:00–00:00', sub: 'Late Zǐ · next calendar day'  },
                  ].map(opt => (
                    <button
                      key={String(opt.id)}
                      onClick={() => setLateZi(opt.id)}
                      style={{
                        flex: 1, textAlign: 'left', padding: '10px 14px',
                        background: lateZi === opt.id ? 'var(--jade-bg)' : 'var(--surface-1)',
                        border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: lateZi === opt.id ? 'var(--jade)' : 'var(--text-dim)' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: 3 }}>
                        {opt.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <Btn label="Calculate BaZi" onClick={submit} large />
            </div>
          </StepCard>
        )}
      </Reveal>
    </div>
  );
}
