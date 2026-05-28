import { useEffect, useRef, useState } from 'react';
import { supabase, SUPABASE_FN_URL } from '../../lib/supabase.js';
import BlurGate from '../paywall/BlurGate.jsx';

const STARTERS = [
  'What career environments suit my chart?',
  'What should I be cautious about this year?',
  'What does my chart suggest about relationships?',
  'How does my current luck pillar affect my finances?',
];

function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[85%] rounded-[16px] px-4 py-3 text-[14px] leading-[1.7]"
        style={isUser
          ? { background: 'rgba(196,145,58,0.12)', color: '#e8e4dd', border: '1px solid rgba(196,145,58,0.2)' }
          : { background: '#0f0f12', color: '#7a7672', border: '1px solid rgba(255,255,255,0.05)' }
        }
      >
        {content}
      </div>
    </div>
  );
}

export default function AskPillars({ chartId, tier, onUpgrade }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chartId || tier !== 'max') return;
    supabase.from('conversations').select('messages').eq('chart_id', chartId).single()
      .then(({ data }) => { if (data?.messages) setMessages(data.messages); });
  }, [chartId, tier]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${SUPABASE_FN_URL}/ask-pillars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ chart_id: chartId, message: text }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? resp.statusText);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError(e.message);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  const Preview = () => (
    <div className="rounded-[22px] p-6" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)', minHeight: 220 }}>
      <div className="space-y-3 mb-4">
        <div className="flex justify-end"><div className="rounded-[12px] px-4 py-2" style={{ background: 'rgba(196,145,58,0.1)', color: '#c4913a', fontSize: 13 }}>What does my chart say about my career?</div></div>
        <div className="flex justify-start"><div className="rounded-[12px] px-4 py-2 max-w-[80%]" style={{ background: '#080809', color: '#5a5754', fontSize: 13, lineHeight: 1.6 }}>Your Yang Wood Day Master suggests environments where you can...</div></div>
      </div>
      <div className="rounded-[10px] px-4 py-3" style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ color: '#2e2c2a', fontSize: 13 }}>Ask anything about your chart…</span>
      </div>
    </div>
  );

  if (tier !== 'max') {
    return (
      <BlurGate required="max" current={tier} label="Ask Pillars — chart-grounded Q&A, unlimited questions" onUpgrade={onUpgrade}>
        <Preview />
      </BlurGate>
    );
  }

  return (
    <div className="rounded-[22px] overflow-hidden" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Message area */}
      <div className="p-5 space-y-3 overflow-y-auto" style={{ maxHeight: 380, minHeight: 180 }}>
        {messages.length === 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-[12px] text-center mb-4" style={{ color: '#3a3733' }}>Ask anything grounded in your chart</p>
            {STARTERS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="w-full text-left rounded-[10px] px-4 py-2.5 text-[13px]"
                style={{ background: '#080809', color: '#5a5754', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-[12px] px-4 py-3" style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#c4913a', animation: 'spin 0.9s linear infinite' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-5 pb-2 text-[12px]" style={{ color: '#d96b54' }}>{error}</p>}

      {/* Input */}
      <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2 mt-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Ask about your chart…"
            className="flex-1 rounded-[10px] px-4 py-2.5 text-[13px] outline-none"
            style={{ background: '#080809', border: '1px solid rgba(255,255,255,0.06)', color: '#e8e4dd' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="rounded-[10px] px-4 py-2.5 text-[13px] font-medium"
            style={{
              background: !input.trim() || loading ? 'rgba(196,145,58,0.15)' : '#c4913a',
              color: !input.trim() || loading ? '#5a5754' : '#070709',
              border: 'none', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
