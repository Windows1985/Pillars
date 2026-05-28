export default function Analysis({ text, loading, error }) {
  if (!loading && !text && !error) return null;

  return (
    <div
      className="rounded-lg p-6 space-y-5"
      style={{ border: '1px solid #1e1e22', background: '#131316' }}
    >
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <h2 className="text-base font-medium" style={{ color: '#ece8e1' }}>Analysis</h2>
          <span className="text-sm font-serif" style={{ color: '#3d3a37' }}>命理解析</span>
        </div>
        <p className="text-xs" style={{ color: '#3d3a37' }}>
          A reading of your chart's key themes, written in plain language. BaZi describes tendencies, not certainties.
        </p>
      </div>

      {loading && (
        <div className="space-y-3 pt-1">
          {[92, 78, 85, 60, 88, 70, 55].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full animate-pulse"
              style={{
                width: `${w}%`,
                background: '#1a1a1e',
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
          <p className="text-xs pt-1" style={{ color: '#3d3a37' }}>Interpreting your chart…</p>
        </div>
      )}

      {error && (
        <div
          className="rounded px-4 py-3"
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <p className="text-xs" style={{ color: '#f87171' }}>
            Analysis unavailable — {error}
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#5a5754' }}>
            Check that your API key is set in <code className="font-mono">src/config.js</code>.
          </p>
        </div>
      )}

      {text && (
        <div className="space-y-5">
          {text.split('\n\n').filter(p => p.trim()).map((para, i) => (
            <p
              key={i}
              className="text-sm leading-7"
              style={{ color: i === 0 ? '#ece8e1' : '#9a9590' }}
            >
              {para.trim()}
            </p>
          ))}
          <div
            className="pt-3 mt-2"
            style={{ borderTop: '1px solid #1a1a1e' }}
          >
            <p className="text-[11px]" style={{ color: '#3d3a37' }}>
              This reading uses classical BaZi methodology. Interpretations are probabilistic tendencies — not predictions. The chart reflects patterns; choices remain yours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
