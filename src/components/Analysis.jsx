export default function Analysis({ text, loading, error }) {
  if (!loading && !text && !error) return null;

  return (
    <div
      className="card-hover rounded-[22px] p-7"
      style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {loading && (
        <div className="space-y-3.5">
          {[88, 72, 82, 58, 78, 65, 50].map((w, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: `${w}%`,
                height: 10,
                background: 'rgba(255,255,255,0.04)',
                animation: `glowPulse 2s ease-in-out ${i * 100}ms infinite`,
              }}
            />
          ))}
          <p className="text-[12px] mt-2" style={{ color: '#2e2c2a' }}>Interpreting your chart…</p>
        </div>
      )}

      {error && (
        <div className="rounded-[14px] px-5 py-4" style={{ background: 'rgba(217,107,84,0.05)', border: '1px solid rgba(217,107,84,0.15)' }}>
          <p className="text-[14px]" style={{ color: '#d96b54' }}>{error}</p>
        </div>
      )}

      {text && (
        <div className="space-y-5">
          {text.split('\n\n').filter(p => p.trim()).map((para, i) => (
            <p
              key={i}
              className="leading-[1.8]"
              style={{
                fontSize: 15,
                color: i === 0 ? '#e8e4dd' : '#7a7672',
                fontStyle: i === 0 ? 'normal' : 'normal',
              }}
            >
              {para.trim()}
            </p>
          ))}
          <p className="text-[11px] pt-3" style={{ color: '#2e2c2a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            BaZi describes patterns and tendencies — not certainties. Interpretations are probabilistic.
          </p>
        </div>
      )}
    </div>
  );
}
