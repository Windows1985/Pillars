import { useState } from 'react';
import { getTodayPillar } from '../bazi/dayPillar.js';

const ELEMENT_INSIGHT = {
  Wood:  'Your Wood is unrooted — strong Water feeds it, no Earth anchors it. This decade activates your Resource pillar. Precision over expansion is not advice. It is structure.',
  Fire:  'Your Fire illuminates every room you enter. The question this decade is sustaining the flame without burning out those closest to it.',
  Earth: 'Your Earth provides the stability others depend on. This decade asks whether you are building for yourself as much as you build for others.',
  Metal: 'Your Metal cuts through ambiguity with precision. This decade tests when to refine what exists rather than forge from scratch.',
  Water: 'Your Water flows around every obstacle with strategic depth. This decade the practice is direction — committing to a current and following it.',
};


export default function Dashboard({ chart, chartId, teaserText, teaserLoading, onNavigate, savedCharts = [], onOpenSaved }) {
  const stem = chart.dayMaster.stem;
  const today = getTodayPillar();
  const insight = teaserText || ELEMENT_INSIGHT[stem.element] || '';
  const todayStem = today.stem;
  const todayBranch = today.branch;

  const age = chart.currentYear - chart.birthDate.year;
  const currentPillar = chart.luckPillars?.pillars?.find(p => age >= p.startAge && age < p.endAge);

  const ELEM_ZH = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };
  const totals = chart.elementBalance?.totals ?? {};
  const balStr = Object.entries(totals)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k, v]) => `${ELEM_ZH[k]}×${Math.round(v * 10) / 10}`)
    .join(' ');

  const bd = chart.birthDate;
  const birthStr = `${bd.year}-${String(bd.month).padStart(2,'0')}-${String(bd.day).padStart(2,'0')}`;

  const techItems = [
    { label: 'Birth', value: birthStr },
    { label: 'Current Luck Pillar', value: currentPillar ? `Age ${currentPillar.startAge}–${currentPillar.endAge}` : '—', jade: true },
    { label: 'Element Balance', value: balStr },
    { label: 'Chart ID', value: chartId ? chartId.slice(0, 8).toUpperCase() : 'Unsaved' },
    { label: 'Generated', value: new Date().toISOString().split('T')[0] },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px 80px' }}>

      {/* ── Hero ── */}
      <div style={{ padding: '72px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>

          {/* Left: Day Master character */}
          <div style={{
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            paddingRight: 64, paddingBottom: 8,
            borderRight: '1px solid var(--border)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              Day Master · 日主
            </div>
            <div style={{
              fontFamily: 'var(--font-cjk)', fontSize: 240, lineHeight: 0.9,
              color: 'var(--text)',
              textShadow: '0 0 100px oklch(58% 0.10 162 / 0.10)',
            }}>
              {stem.char}
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, fontStyle: 'italic', color: 'var(--text-dim)', lineHeight: 1.2 }}>
                {stem.polarity === 'yang' ? 'Yang' : 'Yin'} {stem.element}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 6 }}>
                {stem.pinyin} · 天干
              </div>
            </div>
          </div>

          {/* Right: insight + today's pillar */}
          <div style={{ flex: 1, paddingLeft: 64, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300,
              lineHeight: 1.55, color: 'var(--text)', maxWidth: 520, textWrap: 'pretty',
            }}>
              {teaserLoading
                ? <span style={{ color: 'var(--text-muted)' }}>Reading your chart…</span>
                : insight}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--jade)', flexShrink: 0 }} />
                Today's Pillar · {todayStem.char}{todayBranch.char}日
              </div>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 44, lineHeight: 1, color: 'var(--text-dim)' }}>{todayStem.char}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 3 }}>{todayStem.english}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 20, color: 'var(--border)', paddingBottom: 4 }}>·</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 44, lineHeight: 1, color: 'var(--text-dim)' }}>{todayBranch.char}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 3 }}>{todayBranch.element} {todayBranch.english}</div>
                </div>
              </div>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 300, fontStyle: 'italic',
                lineHeight: 1.75, color: 'var(--text-dim)', textWrap: 'pretty', maxWidth: 440,
              }}>
                {today.reading}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tech strip ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0', marginTop: 48, borderTop: '1px solid var(--border)' }}>
        {techItems.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {i > 0 && <div style={{ width: 1, height: 30, background: 'var(--border)', flexShrink: 0, marginRight: 24 }} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: i === 0 ? 0 : 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: item.jade ? 'var(--jade)' : 'var(--text-dim)' }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

