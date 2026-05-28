import { useState, useRef, useEffect, useCallback } from 'react';

// ─── 12 two-hour blocks (Earthly Branches for birth time) ───────────────────
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

function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Smooth reveal wrapper ───────────────────────────────────────────────────
function Reveal({ show, focusSelector = 'input, button[data-autofocus]', children }) {
  const ref = useRef();
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
        }, 350);
      })
    );
    return () => cancelAnimationFrame(raf);
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={ref}
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : 'translateY(22px)',
        transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Completed step summary row ──────────────────────────────────────────────
function StepSummary({ label, value }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/[0.06] bg-[#131316]">
      <div className="w-1 h-1 rounded-full bg-gold-400 opacity-60 flex-shrink-0" />
      <span className="text-xs text-[#5a5754] flex-shrink-0">{label}</span>
      <span className="text-sm text-[#7a7672] ml-auto text-right">{value}</span>
    </div>
  );
}

// ─── Active step card ────────────────────────────────────────────────────────
function StepCard({ number, question, context, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#131316] overflow-hidden">
      <div className="px-7 pt-7 pb-6">
        <div className="text-[10px] font-medium tracking-[0.15em] text-[#3d3a37] uppercase mb-4">
          {String(number).padStart(2, '0')}
        </div>
        <h2 className="text-[1.25rem] font-medium leading-snug text-[#ece8e1] mb-3">{question}</h2>
        {context && (
          <p className="text-[13px] text-[#5a5754] leading-relaxed border-l-2 border-gold-400/20 pl-3">
            {context}
          </p>
        )}
      </div>
      <div className="px-7 pb-7">{children}</div>
    </div>
  );
}

// ─── Primary action button ────────────────────────────────────────────────────
function Btn({ label, onClick, disabled, variant = 'primary' }) {
  const base = 'inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50';
  const styles = {
    primary: 'bg-gold-400 hover:bg-gold-500 text-[#0c0c0e] disabled:opacity-30 disabled:cursor-not-allowed',
    ghost: 'text-[#5a5754] hover:text-[#ece8e1] hover:bg-white/5',
  };
  return (
    <button
      data-autofocus={variant === 'primary' ? true : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {label}
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
      className="w-full bg-[#1a1a1e] border border-white/[0.08] rounded-xl px-4 py-3 text-[#ece8e1] placeholder-[#3d3a37] text-base focus:outline-none focus:border-gold-400/50 transition-colors duration-200"
    />
  );
}

// ─── Number input ────────────────────────────────────────────────────────────
function NumberInput({ value, onChange, min, max, placeholder }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#1a1a1e] border border-white/[0.08] rounded-xl px-4 py-3 text-[#ece8e1] placeholder-[#3d3a37] text-base focus:outline-none focus:border-gold-400/50 transition-colors duration-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

// ─── Select ────────────────────────────────────────────────────────────────
function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(+e.target.value)}
      className="bg-[#1a1a1e] border border-white/[0.08] rounded-xl px-4 py-3 text-[#ece8e1] text-base focus:outline-none focus:border-gold-400/50 transition-colors duration-200 w-full"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─── Toggle pair (Male / Female) ─────────────────────────────────────────────
function TogglePair({ value, onChange, options }) {
  return (
    <div className="flex gap-3">
      {options.map(o => (
        <button
          key={o.value}
          data-autofocus={o.value === options[0].value ? true : undefined}
          onClick={() => onChange(o.value)}
          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
            value === o.value
              ? 'border-gold-400/60 bg-gold-400/10 text-[#ece8e1]'
              : 'border-white/[0.07] bg-[#1a1a1e] text-[#5a5754] hover:border-white/20 hover:text-[#ece8e1]'
          }`}
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
      {HOUR_BLOCKS.map(h => (
        <button
          key={h.branchIdx}
          data-autofocus={h.branchIdx === 0 ? true : undefined}
          onClick={() => onChange(h.branchIdx)}
          className={`flex flex-col items-center gap-0.5 py-3 px-1 rounded-xl border transition-all duration-200 ${
            value === h.branchIdx
              ? 'border-gold-400/60 bg-gold-400/10'
              : 'border-white/[0.06] bg-[#1a1a1e] hover:border-white/20'
          }`}
        >
          <span className="font-serif text-xl text-[#ece8e1]">{h.char}</span>
          <span className="text-[10px] text-[#5a5754]">{h.pinyin}</span>
          <span className="text-[9px] text-[#3d3a37]">{h.time}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Validation helpers ───────────────────────────────────────────────────────
function validateYear(y) {
  const n = parseInt(y, 10);
  return !isNaN(n) && n >= 1920 && n <= 2011;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function InputForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [name,        setName]        = useState('');
  const [gender,      setGender]      = useState('male');
  const [year,        setYear]        = useState('');
  const [month,       setMonth]       = useState(1);
  const [day,         setDay]         = useState(1);
  const [hourBranch,  setHourBranch]  = useState(0);
  const [lateZi,      setLateZi]      = useState(false);

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

  // Completed step summaries
  const genderLabel = gender === 'male' ? 'Male' : 'Female';
  const selectedHour = HOUR_BLOCKS.find(h => h.branchIdx === hourBranch);
  const hourLabel = selectedHour
    ? `${selectedHour.char} ${selectedHour.pinyin} · ${selectedHour.time}${lateZi ? ' (after 23:00)' : ''}`
    : '';
  const dateLabel = year
    ? `${MONTHS[month - 1]} ${safeDay}, ${year}`
    : '';

  return (
    <div className="space-y-3">

      {/* Step 1 — Name */}
      <Reveal show={step >= 1} focusSelector="input">
        {step > 1 ? (
          <StepSummary label="Name" value={name.trim() || '—'} />
        ) : (
          <StepCard
            number={1}
            question="What's your name?"
            context="Optional. Used only to personalise the chart header — not stored anywhere."
          >
            <TextInput
              value={name}
              onChange={setName}
              placeholder="Enter your name, or leave blank"
              autoFocus
            />
            <div className="mt-4">
              <Btn label="Continue" onClick={() => advance(1)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      {/* Step 2 — Gender */}
      <Reveal show={step >= 2}>
        {step > 2 ? (
          <StepSummary label="Sex at birth" value={genderLabel} />
        ) : (
          <StepCard
            number={2}
            question="What is your sex at birth?"
            context="BaZi uses biological sex to determine the direction your luck pillars run — the ten-year phases that shift your chart's elemental balance over your lifetime."
          >
            <TogglePair
              value={gender}
              onChange={setGender}
              options={[{ value: 'male', label: 'Male 男' }, { value: 'female', label: 'Female 女' }]}
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
          <StepSummary label="Birth year" value={year} />
        ) : (
          <StepCard
            number={3}
            question="What year were you born?"
            context="The Year Pillar captures your generational context and the energy of the era you were born into. Note: the BaZi year starts on 立春 (Lì Chūn, Start of Spring) around February 4th — not January 1st. If you were born in January or early February, your BaZi year may be the previous calendar year."
          >
            <NumberInput
              value={year}
              onChange={setYear}
              min={1920}
              max={2011}
              placeholder="e.g. 1988"
            />
            {year && !validateYear(year) && (
              <p className="mt-2 text-xs text-red-400/80">Enter a year between 1920 and 2011.</p>
            )}
            <div className="mt-4">
              <Btn label="Continue" onClick={() => advance(3)} disabled={!validateYear(year)} />
            </div>
          </StepCard>
        )}
      </Reveal>

      {/* Step 4 — Month and Day */}
      <Reveal show={step >= 4}>
        {step > 4 ? (
          <StepSummary label="Birth date" value={dateLabel} />
        ) : (
          <StepCard
            number={4}
            question="What is your birth date?"
            context="Month and day set your Month Pillar, which is governed by the solar term calendar — not the Gregorian calendar. Each BaZi month begins on a specific solar term date. If you were born within a day of a solar term transition, your month pillar may be uncertain."
          >
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={month}
                onChange={v => { setMonth(v); setDay(d => Math.min(d, daysInMonth(parseInt(year) || 2000, v))); }}
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
          <StepSummary label="Birth time" value={hourLabel} />
        ) : (
          <StepCard
            number={5}
            question="What time were you born?"
            context="The Hour Pillar governs your inner world, hidden talents, and how others experience you in close relationships. Each 2-hour block below is an Earthly Branch — the same twelve symbols used for the animals in the Chinese zodiac cycle."
          >
            <HourGrid value={hourBranch} onChange={setHourBranch} />

            {/* 子 hour sub-question */}
            {hourBranch === 0 && (
              <div
                className="mt-3 p-4 rounded-xl border border-white/[0.06] bg-[#1a1a1e]"
                style={{ animation: 'fadeIn 0.3s ease forwards' }}
              >
                <p className="text-[13px] text-[#5a5754] mb-3">
                  子 (Zǐ) spans midnight. Which half?
                </p>
                <div className="flex gap-3">
                  {[
                    { id: false, label: '00:00–01:00', sub: 'Early Zǐ — uses this calendar day' },
                    { id: true,  label: '23:00–00:00', sub: 'Late Zǐ — uses the next calendar day' },
                  ].map(opt => (
                    <button
                      key={String(opt.id)}
                      onClick={() => setLateZi(opt.id)}
                      className={`flex-1 text-left px-3 py-2.5 rounded-lg border text-xs transition-all duration-200 ${
                        lateZi === opt.id
                          ? 'border-gold-400/50 bg-gold-400/10 text-[#ece8e1]'
                          : 'border-white/[0.06] text-[#5a5754] hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-[10px] mt-0.5 opacity-70">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Btn label="Calculate chart" onClick={submit} />
              <span className="text-xs text-[#3d3a37]">
                {selectedHour?.char} {selectedHour?.animal} hour selected
              </span>
            </div>
          </StepCard>
        )}
      </Reveal>

    </div>
  );
}
