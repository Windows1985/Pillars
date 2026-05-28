import { useEffect, useState } from 'react';
import { supabase, SUPABASE_FN_URL } from '../../lib/supabase.js';
import BlurGate from '../paywall/BlurGate.jsx';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function MonthlyForecast({ chartId, tier, onUpgrade }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chartId || tier === 'free') return;
    setLoading(true);
    setError('');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      try {
        const resp = await fetch(`${SUPABASE_FN_URL}/generate-forecast`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ chart_id: chartId, year, month }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error ?? resp.statusText);
        setContent(data.content);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });
  }, [chartId, tier, year, month]);

  const Preview = () => (
    <div className="card-hover rounded-[22px] p-6" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#4a4844' }}>
          {MONTH_NAMES[month - 1]} {year}
        </div>
      </div>
      <div className="space-y-2">
        {[82, 68, 75, 55, 60].map((w, i) => (
          <div key={i} className="rounded-full" style={{ width: `${w}%`, height: 8, background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    </div>
  );

  if (tier === 'free') {
    return (
      <BlurGate required="pro" current="free" label="Monthly forecast unlocks with Pro" onUpgrade={onUpgrade}>
        <Preview />
      </BlurGate>
    );
  }

  return (
    <div className="card-hover rounded-[22px] p-6" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: '#4a4844' }}>
        {MONTH_NAMES[month - 1]} {year} · Monthly Forecast
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-4">
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#c4913a', animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
          <span className="text-[13px]" style={{ color: '#4a4844' }}>Generating forecast…</span>
        </div>
      )}

      {error && <p className="text-[13px]" style={{ color: '#d96b54' }}>{error}</p>}

      {content && (
        <div className="space-y-4">
          {content.split('\n\n').filter(p => p.trim()).map((para, i) => (
            <p key={i} className="text-[14px] leading-[1.8]" style={{ color: i === 0 ? '#e8e4dd' : '#7a7672' }}>
              {para.trim()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
