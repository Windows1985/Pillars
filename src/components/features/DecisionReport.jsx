import { useEffect, useState } from 'react';
import { supabase, SUPABASE_FN_URL } from '../../lib/supabase.js';
import BlurGate from '../paywall/BlurGate.jsx';

const TEMPLATES = [
  { key: 'job', label: 'Career move', desc: 'Should I take this job or change roles now?' },
  { key: 'business', label: 'Start a business', desc: 'Is this the right time to launch?' },
  { key: 'marriage', label: 'Marriage timing', desc: 'When is your chart aligned for long-term commitment?' },
  { key: 'relocation', label: 'Relocation', desc: 'Does your luck cycle favour a geographic move?' },
  { key: 'custom', label: 'Custom decision', desc: 'Any question grounded in your chart' },
];

export default function DecisionReport({ chartId, tier, onUpgrade }) {
  const [selected, setSelected] = useState(null);
  const [question, setQuestion] = useState('');
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('list'); // 'list' | 'compose' | 'result'

  useEffect(() => {
    if (!chartId || tier !== 'max') return;
    supabase.from('decision_reports').select('*').eq('chart_id', chartId).order('created_at', { ascending: false })
      .then(({ data }) => setReports(data ?? []));
  }, [chartId, tier]);

  async function generate() {
    if (!selected || !question.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${SUPABASE_FN_URL}/decision-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ chart_id: chartId, template: selected, question }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? resp.statusText);
      setReport(data.content);
      setReports(prev => [{ template: selected, question, content: data.content, created_at: new Date().toISOString() }, ...prev]);
      setStep('result');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const Preview = () => (
    <div className="rounded-[22px] p-6" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[11px] uppercase tracking-widest mb-4" style={{ color: '#3a3733' }}>Decision Reports</div>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.slice(0, 4).map(t => (
          <div key={t.key} className="rounded-[12px] p-3" style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-[12px] font-medium mb-1" style={{ color: '#4a4844' }}>{t.label}</div>
            <div className="text-[11px]" style={{ color: '#2e2c2a' }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (tier !== 'max') {
    return (
      <BlurGate required="max" current={tier} label="Decision Reports — structured guidance on specific decisions" onUpgrade={onUpgrade}>
        <Preview />
      </BlurGate>
    );
  }

  if (step === 'result' && report) {
    return (
      <div className="rounded-[22px] p-6" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setStep('list'); setReport(null); }} className="text-[12px]" style={{ color: '#4a4844', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
          <span className="text-[12px]" style={{ color: '#3a3733' }}>{TEMPLATES.find(t => t.key === selected)?.label}</span>
        </div>
        <p className="text-[12px] mb-4 px-3 py-2 rounded-[8px]" style={{ background: '#080809', color: '#4a4844', fontStyle: 'italic' }}>"{question}"</p>
        <div className="space-y-4">
          {report.split('\n\n').filter(p => p.trim()).map((para, i) => (
            <p key={i} className="text-[14px] leading-[1.8]" style={{ color: i === 0 ? '#e8e4dd' : '#7a7672' }}>{para.trim()}</p>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'compose') {
    const tpl = TEMPLATES.find(t => t.key === selected);
    return (
      <div className="rounded-[22px] p-6" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => setStep('list')} className="text-[12px] mb-5 block" style={{ color: '#4a4844', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
        <h3 className="text-base font-medium mb-1" style={{ color: '#e8e4dd' }}>{tpl?.label}</h3>
        <p className="text-[12px] mb-5" style={{ color: '#4a4844' }}>{tpl?.desc}</p>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={`Describe your specific situation…`}
          rows={4}
          className="w-full rounded-[12px] px-4 py-3 text-[13px] outline-none resize-none mb-4"
          style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.07)', color: '#e8e4dd' }}
        />
        {error && <p className="text-[12px] mb-3" style={{ color: '#d96b54' }}>{error}</p>}
        <button
          onClick={generate}
          disabled={!question.trim() || loading}
          className="w-full rounded-[12px] py-3 text-sm font-medium"
          style={{
            background: !question.trim() || loading ? 'rgba(196,145,58,0.2)' : '#c4913a',
            color: !question.trim() || loading ? '#5a5754' : '#070709',
            border: 'none', cursor: !question.trim() || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Generating…' : 'Generate report'}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] p-6" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[11px] uppercase tracking-widest mb-4" style={{ color: '#3a3733' }}>Decision Reports</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        {TEMPLATES.map(t => (
          <button
            key={t.key}
            onClick={() => { setSelected(t.key); setQuestion(''); setStep('compose'); }}
            className="text-left rounded-[12px] p-3 transition-all"
            style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'; e.currentTarget.style.background = '#0f0f12'; }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.04)'; e.currentTarget.style.background = '#080809'; e.currentTarget.style.transform = 'none'; }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
          >
            <div className="text-[12px] font-medium mb-0.5" style={{ color: '#e8e4dd' }}>{t.label}</div>
            <div className="text-[11px]" style={{ color: '#4a4844' }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {reports.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#2e2c2a' }}>Past reports</div>
          <div className="space-y-1.5">
            {reports.slice(0, 5).map((r, i) => (
              <button
                key={i}
                onClick={() => { setSelected(r.template); setQuestion(r.question); setReport(r.content); setStep('result'); }}
                className="w-full text-left rounded-[10px] px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.02)', border: 'none', cursor: 'pointer' }}
              >
                <div className="text-[12px]" style={{ color: '#5a5754' }} title={r.question}>{TEMPLATES.find(t => t.key === r.template)?.label} · <span style={{ color: '#3a3733' }}>{r.question.slice(0, 80)}{r.question.length > 80 ? '…' : ''}</span></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
