import { useState } from 'react';

export default function BlurGate({ required, current, label, children, onUpgrade }) {
  const tiers = ['free', 'pro', 'max'];
  const locked = tiers.indexOf(current) < tiers.indexOf(required);

  if (!locked) return children;

  const tierLabel = required === 'pro' ? 'Pro' : 'Max';
  const price = required === 'pro' ? 'HK$50/mo' : 'HK$100/mo';

  return (
    <div className="relative rounded-[22px] overflow-hidden">
      {/* Blurred content */}
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }}>
        {children}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[22px]"
        style={{ background: 'rgba(7,7,9,0.55)', backdropFilter: 'blur(2px)' }}
      >
        <div className="text-center px-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: 'rgba(196,145,58,0.12)', color: '#c4913a', border: '1px solid rgba(196,145,58,0.25)' }}
          >
            {tierLabel}
          </div>
          <p className="text-[13px] mb-4" style={{ color: '#7a7672' }}>
            {label ?? `Unlock ${label ?? 'this section'} with ${tierLabel}`}
          </p>
          <button
            onClick={onUpgrade}
            className="rounded-[10px] px-5 py-2.5 text-sm font-medium"
            style={{ background: '#c4913a', color: '#070709', border: 'none', cursor: 'pointer' }}
          >
            Upgrade to {tierLabel} · {price}
          </button>
        </div>
      </div>
    </div>
  );
}
