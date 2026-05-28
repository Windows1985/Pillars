export default function Analysis({ text, loading, error }) {
  if (!loading && !text && !error) return null;

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-6 space-y-4">
      <h2 className="text-sm font-medium text-neutral-300">Analysis</h2>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[0.9, 0.7, 0.85, 0.6, 0.75].map((w, i) => (
            <div key={i} className="h-3 bg-neutral-700 rounded" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">
          Analysis unavailable: {error}
        </p>
      )}

      {text && (
        <div className="space-y-4">
          {text.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-sm text-neutral-300 leading-relaxed">
              {para.trim()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
