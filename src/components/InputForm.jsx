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

// ─── Smooth reveal ───────────────────────────────────────────────────────────
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
        transform: entered ? 'none' : 'translateY(18px)',
        transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Completed step chip ─────────────────────────────────────────────────────
function Done({ label, value }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3"
      style={{
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#c4913a', opacity: 0.5 }} />
      <span className="text-xs flex-shrink-0" style={{ color: '#5a5754' }}>{label}</span>
      <span className="text-sm ml-auto text-right" style={{ color: '#7a7672' }}>{value}</span>
    </div>
  );
}

// ─── Step card ───────────────────────────────────────────────────────────────
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
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#131316',
        overflow: 'hidden',
      }}
    >
      <div className="px-7 pt-7 pb-5">
        <div
          className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-4"
          style={{ color: '#3a3733' }}
        >
          {String(n).padStart(2, '0')}
        </div>
        <h2
          className="font-medium leading-snug mb-3"
          style={{ fontSize: 22, color: '#e8e4dd' }}
        >
          {question}
        </h2>
        {context && (
          <p
            className="text-[13px] leading-relaxed"
            style={{
              color: '#5a5754',
              borderLeft: '2px solid rgba(196,145,58,0.18)',
              paddingLeft: 12,
            }}
          >
            {context}
          </p>
        )}
      </div>
      <div className="px-7 pb-7">{children}</div>
    </div>
  );
}

// ─── Primary button ───────────────────────────────────────────────────────────
function Btn({ label, onClick, disabled, large }) {
  return (
    <button
      data-autofocus
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 font-semibold transition-all duration-150 active:scale-[0.97] focus:outline-none"
      style={{
        borderRadius: large ? 18 : 14,
        padding: large ? '14px 24px' : '10px 18px',
        fontSize: large ? 16 : 14,
        background: disabled ? 'rgba(196,145,58,0.25)' : '#c4913a',
        color: disabled ? 'rgba(12,12,14,0.4)' : '#0c0c0e',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: large ? '100%' : undefined,
        justifyContent: large ? 'center' : undefined,
      }}
    >
      {label}
      {!large && <span style={{ opacity: 0.6, fontSize: 16 }}>→</span>}
    </button>
  );
}

// ─── Text input ───────────────────────────────────────────────────────────────
function TextInput({ value, onChange, placeholder, autoFocus }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full text-base focus:outline-none transition-all duration-200"
      style={{
        background: '#1c1c20',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '12px 16px',
        color: '#e8e4dd',
        caretColor: '#c4913a',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(196,145,58,0.4)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
    />
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────
function NumberInput({ value, onChange, min, max, placeholder }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-base focus:outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      style={{
        background: '#1c1c20',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '12px 16px',
        color: '#e8e4dd',
        caretColor: '#c4913a',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(196,145,58,0.4)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
    />
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(+e.target.value)}
      className="w-full text-base focus:outline-none"
      style={{
        background: '#1c1c20',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '12px 16px',
        color: '#e8e4dd',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── Toggle pair ──────────────────────────────────────────────────────────────
function TogglePair({ value, onChange, options }) {
  return (
    <div
      className="flex gap-px p-1"
      style={{ background: '#1c1c20', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {options.map(o => (
        <button
          key={o.value}
          data-autofocus={o.value === options[0].value ? true : undefined}
          onClick={() => onChange(o.value)}
          className="flex-1 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none"
          style={{
            borderRadius: 12,
            background: value === o.value ? 'rgba(196,145,58,0.15)' : 'transparent',
            color: value === o.value ? '#e8e4dd' : '#5a5754',
            border: value === o.value ? '1px solid rgba(196,145,58,0.3)' : '1px solid transparent',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Hour grid ────────────────────────────────────────────────────────────────
function HourGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {HOUR_BLOCKS.map(h => {
        const active = value === h.branchIdx;
        return (
          <button
            key={h.branchIdx}
            data-autofocus={h.branchIdx === 0 ? true : undefined}
            onClick={() => onChange(h.branchIdx)}
            className="flex flex-col items-center gap-0.5 py-3 transition-all duration-200 active:scale-[0.96] focus:outline-none"
            style={{
              borderRadius: 14,
              background: active ? 'rgba(196,145,58,0.1)' : '#1c1c20',
              border: active ? '1px solid rgba(196,145,58,0.35)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span className="font-serif text-xl" style={{ color: active ? '#e8e4dd' : '#9a9590' }}>{h.char}</span>
            <span className="text-[10px]" style={{ color: active ? '#c4913a' : '#5a5754' }}>{h.pinyin}</span>
            <span className="text-[9px]" style={{ color: '#3a3733' }}>{h.time}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function InputForm({ onSubmit }) {
  const [step, setStep]           = useState(1);
  const [name, setName]           = useState('');
  const [gender, setGender]       = useState('male');
  const [year, setYear]           = useState('');
  const [month, setMonth]         = useState(1);
  const [day, setDay]             = useState(1);
  const [hourBranch, setHourBranch] = useState(0);
  const [lateZi, setLateZi]       = useState(false);

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
    <div className="space-y-2.5">

      {/* Step 1 — Name */}
      <Reveal show={step >= 1} focusSelector="input">
        {step > 1 ? (
          <Done label="Name" value={name.trim() || '—'} />
        ) : (
          <StepCard
            n={1}
            question="What's your name?"
            context="Optional — used only to personalise the chart header. Nothing is stored."
            onEnter={() => advance(1)}
          >
            <TextInput value={name} onChange={setName} placeholder="Your name, or leave blank" autoFocus />
            <div className="mt-4">
              <Btn label="Continue" onClick={() => advance(1)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      {/* Step 2 — Gender */}
      <Reveal show={step >= 2}>
        {step > 2 ? (
          <Done label="Sex at birth" value={genderLabel} />
        ) : (
          <StepCard
            n={2}
            question="What is your sex at birth?"
            context="BaZi uses biological sex to determine which direction your luck pillars run — the 10-year chapters that shift the elemental balance of each decade of your life."
            onEnter={() => advance(2)}
          >
            <TogglePair
              value={gender}
              onChange={setGender}
              options={[
                { value: 'male',   label: 'Male 男'   },
                { value: 'female', label: 'Female 女' },
              ]}
            />
            <div className="mt-4">
              <Btn label="Continue" onClick={() => advance(2)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      {/* Step 3 — Year */}
      <Reveal show={step >= 3} focusSelector="input">
        {step > 3 ? (
          <Done label="Birth year" value={year} />
        ) : (
          <StepCard
            n={3}
            question="What year were you born?"
            context="The Year Pillar captures your generational energy. Note: the BaZi year begins on 立春 (Lì Chūn, Start of Spring) around February 4th — not January 1st. If you were born in January or early February, your BaZi year may be the previous calendar year."
            onEnter={() => validateYear(year) && advance(3)}
          >
            <NumberInput
              value={year}
              onChange={setYear}
              min={1920}
              max={2011}
              placeholder="e.g. 1988"
            />
            {year && !validateYear(year) && (
              <p className="mt-2 text-xs" style={{ color: '#ef4444', opacity: 0.8 }}>
                Enter a year between 1920 and 2011.
              </p>
            )}
            <div className="mt-4">
              <Btn label="Continue" onClick={() => advance(3)} disabled={!validateYear(year)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      {/* Step 4 — Month & Day */}
      <Reveal show={step >= 4}>
        {step > 4 ? (
          <Done label="Birth date" value={dateLabel} />
        ) : (
          <StepCard
            n={4}
            question="What is your birth date?"
            context="Month and day set your Month Pillar. BaZi months are governed by the solar term calendar — each begins on a specific date called a 节 (jié). If you were born within a day of a solar term, your month pillar may be uncertain."
            onEnter={() => advance(4)}
          >
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={month}
                onChange={v => {
                  setMonth(v);
                  setDay(d => Math.min(d, daysInMonth(parseInt(year) || 2000, v)));
                }}
                options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))}
              />
              <Select
                value={safeDay}
                onChange={setDay}
                options={Array.from({ length: maxDay }, (_, i) => ({ value: i + 1, label: String(i + 1) }))}
              />
            </div>
            <div className="mt-4">
              <Btn label="Continue" onClick={() => advance(4)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      {/* Step 5 — Time */}
      <Reveal show={step >= 5}>
        {step > 5 ? (
          <Done label="Birth time" value={hourLabel} />
        ) : (
          <StepCard
            n={5}
            question="What time were you born?"
            context="The Hour Pillar governs your inner world and close relationships. Each 2-hour block is an Earthly Branch (地支) — the same twelve symbols as the Chinese zodiac animals."
            onEnter={submit}
          >
            <HourGrid value={hourBranch} onChange={setHourBranch} />

            {hourBranch === 0 && (
              <div
                className="mt-3 p-4"
                style={{
                  borderRadius: 14,
                  background: '#1c1c20',
                  border: '1px solid rgba(255,255,255,0.06)',
                  animation: 'fadeIn 0.3s ease both',
                }}
              >
                <p className="text-[13px] mb-3" style={{ color: '#5a5754' }}>
                  子 (Zǐ) spans midnight. Which half?
                </p>
                <div className="flex gap-2">
                  {[
                    { id: false, label: '00:00–01:00', sub: 'Early Zǐ · this calendar day' },
                    { id: true,  label: '23:00–00:00', sub: 'Late Zǐ · next calendar day'  },
                  ].map(opt => (
                    <button
                      key={String(opt.id)}
                      onClick={() => setLateZi(opt.id)}
                      className="flex-1 text-left px-3 py-2.5 text-xs transition-all duration-200 active:scale-[0.97] focus:outline-none"
                      style={{
                        borderRadius: 10,
                        background: lateZi === opt.id ? 'rgba(196,145,58,0.1)' : 'rgba(255,255,255,0.03)',
                        border: lateZi === opt.id ? '1px solid rgba(196,145,58,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        color: lateZi === opt.id ? '#e8e4dd' : '#5a5754',
                      }}
                    >
                      <div className="font-semibold">{opt.label}</div>
                      <div className="mt-0.5 text-[10px] opacity-60">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <Btn
                label="Calculate BaZi"
                onClick={submit}
                large
              />
            </div>
          </StepCard>
        )}
      </Reveal>

    </div>
  );
}
