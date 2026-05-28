import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { supabase, SUPABASE_FN_URL } from '../../lib/supabase.js';

const TIERS = [
  {
    key: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    color: '#5a5754',
    features: [
      'Full chart calculation',
      '3-sentence AI teaser',
      '1 saved chart',
      'All pillars & elements visible',
    ],
    locked: [],
  },
  {
    key: 'pro',
    name: 'Pro',
    priceMonthly: 50,
    priceAnnual: 420,
    currency: 'HK$',
    usdMonthly: 4.99,
    usdAnnual: 39.99,
    color: '#c4913a',
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
    priceMonthly: 100,
    priceAnnual: 840,
    currency: 'HK$',
    usdMonthly: 10.99,
    usdAnnual: 89.99,
    color: '#5592b8',
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

export default function PricingPage({ onClose, currentTier, initialPlan }) {
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(7,7,9,0.9)', backdropFilter: 'blur(10px)' }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-full max-w-3xl py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium mb-2" style={{ color: '#e8e4dd' }}>Unlock the full picture</h2>
          <p className="text-sm" style={{ color: '#5a5754' }}>Chart calculation is always free. Upgrade for analysis, forecasts, and Q&A.</p>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-sm" style={{ color: annual ? '#4a4844' : '#e8e4dd' }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative rounded-full transition-colors"
              style={{
                width: 44, height: 24,
                background: annual ? '#c4913a' : 'rgba(255,255,255,0.1)',
                border: 'none', cursor: 'pointer',
              }}
            >
              <span
                className="absolute top-1 rounded-full transition-all"
                style={{
                  width: 16, height: 16,
                  background: '#fff',
                  left: annual ? 24 : 4,
                }}
              />
            </button>
            <span className="text-sm" style={{ color: annual ? '#e8e4dd' : '#4a4844' }}>
              Annual <span className="text-[11px] ml-1" style={{ color: '#c4913a' }}>−30%</span>
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-[14px] px-5 py-3 text-sm text-center" style={{ background: 'rgba(217,107,84,0.06)', color: '#d96b54', border: '1px solid rgba(217,107,84,0.15)' }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                className="rounded-[20px] p-6"
                style={{
                  background: isCurrent ? `linear-gradient(160deg, rgba(196,145,58,0.06), #0f0f12)` : '#0f0f12',
                  border: isCurrent ? `1px solid rgba(196,145,58,0.2)` : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: tier.color }}>{tier.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(196,145,58,0.1)', color: '#c4913a', border: '1px solid rgba(196,145,58,0.2)' }}>
                      Current
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <div className="text-2xl font-medium" style={{ color: '#e8e4dd' }}>{price}</div>
                  {subPrice && <div className="text-[11px] mt-0.5" style={{ color: '#3a3733' }}>{subPrice}</div>}
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: i === 0 ? '#4a4844' : '#7a7672' }}>
                      <span style={{ color: tier.color, flexShrink: 0 }}>·</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {tier.key !== 'free' && !isCurrent && (
                  <button
                    onClick={() => handleUpgrade(tier)}
                    disabled={!!loading}
                    className="w-full rounded-[10px] py-2.5 text-sm font-medium"
                    style={{
                      background: loading === tier.key ? 'rgba(196,145,58,0.3)' : tier.color,
                      color: '#070709',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
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
          <div className="text-center mt-8">
            <button onClick={onClose} className="text-[12px]" style={{ color: '#3a3733', background: 'none', border: 'none', cursor: 'pointer' }}>
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
