import { useState } from 'react';

export default function BlurGate({ required, current, label, children, onUpgrade }) {
  const tiers = ['free', 'pro', 'max'];
  const locked = tiers.indexOf(current) < tiers.indexOf(required);

  if (!locked) return children;

  const tierLabel = required === 'pro' ? 'Pro' : 'Max';
  const price = required === 'pro' ? 'HK$50/mo' : 'HK$100/mo';

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }}>
        {children}
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(9, 9, 11, 0.6)', backdropFilter: 'blur(2px)',
        gap: 16,
      }}>
        <div style={{ textAlign: 'center', padding: '0 32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 12px', marginBottom: 12,
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#c4913a',
            background: 'rgba(196,145,58,0.1)', border: '1px solid rgba(196,145,58,0.22)',
          }}>
            {tierLabel}
          </div>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 300,
            color: 'var(--text-dim)', marginBottom: 20, lineHeight: 1.6,
          }}>
            {label ?? `Unlock this section with ${tierLabel}`}
          </p>
          <button
            onClick={onUpgrade}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '10px 24px',
              background: '#c4913a', color: '#070709',
              border: 'none', cursor: 'pointer',
            }}
          >
            Upgrade to {tierLabel} · {price}
          </button>
        </div>
      </div>
    </div>
  );
}
