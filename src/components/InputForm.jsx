import { useState } from 'react';
import { BRANCHES } from '../bazi/constants.js';

const HOUR_OPTIONS = [
  { branchIdx: 0,  label: '子 Zǐ',   range: '23:00–01:00' },
  { branchIdx: 1,  label: '丑 Chǒu', range: '01:00–03:00' },
  { branchIdx: 2,  label: '寅 Yín',  range: '03:00–05:00' },
  { branchIdx: 3,  label: '卯 Mǎo',  range: '05:00–07:00' },
  { branchIdx: 4,  label: '辰 Chén', range: '07:00–09:00' },
  { branchIdx: 5,  label: '巳 Sì',   range: '09:00–11:00' },
  { branchIdx: 6,  label: '午 Wǔ',   range: '11:00–13:00' },
  { branchIdx: 7,  label: '未 Wèi',  range: '13:00–15:00' },
  { branchIdx: 8,  label: '申 Shēn', range: '15:00–17:00' },
  { branchIdx: 9,  label: '酉 Yǒu',  range: '17:00–19:00' },
  { branchIdx: 10, label: '戌 Xū',   range: '19:00–21:00' },
  { branchIdx: 11, label: '亥 Hài',  range: '21:00–23:00' },
];

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export default function InputForm({ onSubmit }) {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hourBranch, setHourBranch] = useState(0);
  const [isLateZiHour, setIsLateZiHour] = useState(false);
  const [gender, setGender] = useState('male');
  const [name, setName] = useState('');

  const maxDay = daysInMonth(year, month);
  if (day > maxDay) setDay(maxDay);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ year: +year, month: +month, day: +day, hourBranch, isLateZiHour, gender, name });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name */}
        <div className="lg:col-span-2">
          <label className="block text-xs text-neutral-400 mb-1">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Gender</label>
          <div className="flex gap-2">
            {['male', 'female'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-2 text-sm rounded border transition-colors ${
                  gender === g
                    ? 'bg-gold-400 border-gold-400 text-neutral-900 font-medium'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                }`}
              >
                {g === 'male' ? 'Male 男' : 'Female 女'}
              </button>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Year */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-2">
          <label className="block text-xs text-neutral-400 mb-1">Year 年</label>
          <input
            type="number"
            value={year}
            min={1920}
            max={2011}
            onChange={e => setYear(+e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Month 月</label>
          <select
            value={month}
            onChange={e => setMonth(+e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-gold-400"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Day 日</label>
          <select
            value={day}
            onChange={e => setDay(+e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-gold-400"
          >
            {Array.from({ length: maxDay }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        {/* Hour branch */}
        <div className="col-span-2">
          <label className="block text-xs text-neutral-400 mb-1">Hour 时</label>
          <select
            value={hourBranch}
            onChange={e => { setHourBranch(+e.target.value); if (+e.target.value !== 0) setIsLateZiHour(false); }}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-gold-400"
          >
            {HOUR_OPTIONS.map(o => (
              <option key={o.branchIdx} value={o.branchIdx}>
                {o.label} — {o.range}
              </option>
            ))}
          </select>
          {hourBranch === 0 && (
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isLateZiHour}
                onChange={e => setIsLateZiHour(e.target.checked)}
                className="accent-gold-400"
              />
              <span className="text-xs text-neutral-400">23:00–00:00 (uses next day's pillar)</span>
            </label>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-neutral-900 font-medium text-sm rounded transition-colors"
      >
        Calculate Chart
      </button>
    </form>
  );
}
