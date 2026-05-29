import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { supabase, SUPABASE_FN_URL, SUPABASE_ANON_KEY } from '../../lib/supabase.js';
import * as Dialog from '@radix-ui/react-dialog';

const TIERS = [
  {
    key: 'free',
    name: 'Free',
    nameZh: '免费',
    priceMonthly: 0,
    priceAnnual: 0,
    accentColor: 'var(--text-muted)',
    features: [
      'Full chart calculation',
      '3-sentence AI teaser',
      '1 saved chart',
      'All pillars & elements visible',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    nameZh: '专业',
    priceMonthly: 50,
    priceAnnual: 420,
    currency: 'HK$',
    usdMonthly: 4.99,
    usdAnnual: 39.99,
    accentColor: '#c4913a',
    features: [
      'Everything in Free',
      'Full natal analysis (cached forever)',
      'Monthly forecast — auto-refreshes',
      'Compatibility with up to 10 charts',
      'Unlimited saved charts',
      'Downloadable PDF analysis',
    ],
    priceIdMonthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
    priceIdAnnual: import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID,
  },
  {
    key: 'max',
    name: 'Max',
    nameZh: '至尊',
    priceMonthly: 100,
    priceAnnual: 840,
    currency: 'HK$',
    usdMonthly: 10.99,
    usdAnnual: 89.99,
    accentColor: '#5592b8',
    features: [
      'Everything in Pro',
      '"Ask Pillars" — chart-grounded Q&A',
      'Decision Reports (job, business, timing)',
      'Daily + monthly + annual transit stack',
      'Unlimited compatibility checks',
      'Regenerate natal analysis anytime',
    ],
    priceIdMonthly: import.meta.env.VITE_STRIPE_MAX_MONTHLY_PRICE_ID,
    priceIdAnnual: import.meta.env.VITE_STRIPE_MAX_ANNUAL_PRICE_ID,
  },
];

export default function PricingPage({ open, onClose, currentTier }) {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  async function handleUpgrade(tier) {
    if (!user) return;
    const priceId = annual ? tier.priceIdAnnual : tier.priceIdMonthly;
    if (!priceId) {
      setError('Stripe not configured — add price IDs to environment variables.');
      return;
    }
    setLoading(tier.key);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${SUPABASE_FN_URL}/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ price_id: priceId, success_url: window.location.href, cancel_url: window.location.href }),
      });
      const data = await resp.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error ?? 'Checkout failed');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '0 24px 48px', overflowY: 'auto',
          background: 'rgba(7,7,9,0.9)', backdropFilter: 'blur(10px)',
        }}>
          <Dialog.Content
            style={{ width: '100%', maxWidth: 780, paddingTop: 72, outline: 'none' }}
            onPointerDownOutside={() => onClose?.()}
          >
            <Dialog.Title style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
              Pricing
            </Dialog.Title>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
                Pricing · 定价
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, fontStyle: 'italic',
                color: 'var(--text)', marginBottom: 10,
              }}>
                Unlock the full picture
              </h2>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Chart calculation is always free. Upgrade for analysis, forecasts, and Q&A.
              </p>

              {/* Billing toggle */}
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1, marginTop: 28, background: 'var(--border)' }}>
                {[{ id: false, label: 'Monthly' }, { id: true, label: 'Annual  −30%' }].map(opt => (
                  <button
                    key={String(opt.id)}
                    onClick={() => setAnnual(opt.id)}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '9px 20px',
                      background: annual === opt.id ? 'var(--jade-bg)' : 'var(--surface-1)',
                      color: annual === opt.id ? 'var(--jade)' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                marginBottom: 24, padding: '12px 16px', textAlign: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
                background: 'rgba(217,107,84,0.06)', color: '#d96b54', border: '1px solid rgba(217,107,84,0.15)',
              }}>
                {error}
              </div>
            )}

            {/* Tier cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
              {TIERS.map(tier => {
                const isCurrent = currentTier === tier.key;
                const price = tier.priceMonthly === 0 ? 'Free' : annual
                  ? `HK$${Math.round(tier.priceAnnual / 12)}/mo`
                  : `HK$${tier.priceMonthly}/mo`;
                const subPrice = tier.priceMonthly === 0 ? null : annual
                  ? `HK$${tier.priceAnnual} billed annually`
                  : `~US$${tier.usdMonthly}/mo`;

                return (
                  <div
                    key={tier.key}
                    style={{
                      background: isCurrent ? 'var(--surface-2)' : 'var(--surface-1)',
                      padding: '32px 28px 28px',
                      borderTop: isCurrent ? `2px solid ${tier.accentColor}` : '2px solid transparent',
                      display: 'flex', flexDirection: 'column',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-cjk)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                          {tier.nameZh}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: tier.accentColor }}>
                          {tier.name}
                        </div>
                      </div>
                      {isCurrent && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase',
                          padding: '3px 10px', color: tier.accentColor,
                          background: `${tier.accentColor}18`, border: `1px solid ${tier.accentColor}40`,
                        }}>
                          Current
                        </span>
                      )}
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, color: 'var(--text)', lineHeight: 1 }}>
                        {price}
                      </div>
                      {subPrice && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: 6 }}>
                          {subPrice}
                        </div>
                      )}
                    </div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
                      {tier.features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: tier.accentColor, flexShrink: 0, lineHeight: 1.5 }}>·</span>
                          <span style={{
                            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 300, lineHeight: 1.5,
                            color: i === 0 ? 'var(--text-muted)' : 'var(--text-dim)',
                          }}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {tier.key !== 'free' && !isCurrent && (
                      <button
                        onClick={() => handleUpgrade(tier)}
                        disabled={!!loading}
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                          padding: '11px 0', width: '100%',
                          background: loading === tier.key ? 'transparent' : `${tier.accentColor}18`,
                          color: loading === tier.key ? 'var(--text-muted)' : tier.accentColor,
                          border: `1px solid ${tier.accentColor}40`,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'background 0.15s',
                        }}
                      >
                        {loading === tier.key ? '…' : `Upgrade to ${tier.name}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {onClose && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                    color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  Maybe later
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
