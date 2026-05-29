# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start Vite dev server (localhost:5173)
npm run build    # production build → dist/
npm run preview  # serve dist/ locally
```

No test runner is configured. Verify changes via the dev server.

## Architecture

Single-page React app with no router. Navigation is explicit state in `App.jsx` via a `screen` string (`'landing' | 'form' | 'dashboard' | 'chart' | 'analysis' | 'timeline'`). Each screen is a full-page component; `AppShell` wraps them all with the persistent nav.

### Data flow

1. User submits birth data → `calculateChart()` (pure, local, no API) → `chart` object stored in App state
2. `chart` is passed down to every screen as a prop — never re-fetched from a server
3. AI analysis is triggered in `App.jsx` after chart calculation. Three paths:
   - **Anon**: `generateAnalysis(chart)` → `src/api/analysis.js` → direct fetch to `CHR_API_URL` (GLM model, keyed in `src/config.js`)
   - **Free/Pro user teaser**: `generateTeaser(chartId)` → Supabase Edge Function `generate-analysis`
   - **Pro/Max full natal**: `generateNatal(chartId)` → same Edge Function with `type: 'natal'`

### Auth & tier

`AuthContext` holds `user`, `profile`, `tier` (`'free' | 'pro' | 'max'`), `isPro`, `isMax`. Tier is read from `profiles.tier` in Supabase. `BlurGate` wraps locked content and compares tier indices to gate rendering.

### Supabase Edge Functions

All `fetch()` calls to Supabase functions require **both** headers:
```js
{ Authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_ANON_KEY }
```
`SUPABASE_ANON_KEY` is exported from `src/lib/supabase.js`. Missing either header → 401.

Edge functions expected by the frontend:
- `generate-analysis` — takes `{ chart_id, type: 'teaser' | 'natal' }`, returns `{ content }`
- `create-checkout` — takes `{ price_id, success_url, cancel_url }`, returns `{ url }` (Stripe Checkout URL)

### BaZi calculation

Pure logic in `src/bazi/`. Entry point is `calculate.js` → `calculateChart(formData)` returns the full chart object (pillars, element balance, luck pillars, interactions). All constants (stems, branches, hidden stems, ten gods, ELEM colour tokens) live in `constants.js`.

### Design system

Defined in `src/index.css` CSS variables and `tailwind.config.js`. Key rules:

- **Never hardcode hex values for text/surface colours** — use `var(--text)`, `var(--text-dim)`, `var(--text-muted)`, `var(--surface-0..2)`, `var(--border)`
- **Element colours** come from `ELEM[element].hex` in JS — Wood `#6abf7a`, Fire `#d96b54`, Earth `#c4913a`, Metal `#9db0c2`, Water `#5592b8`
- **Font stack**: `var(--font-display)` (Fraunces serif) for headings, `var(--font-mono)` (JetBrains Mono) for labels/data, `var(--font-cjk)` (Noto Serif SC) for Chinese characters
- **Spacing**: 4px base unit, multiples of 4 only
- **Loading states**: always skeleton (`.skeleton-line` class + `skeletonPulse` animation), never spinner — the chart-calculation screen in `App.jsx` is the sole exception

### Stripe / subscription

The frontend is fully wired — `PricingPage` reads price IDs from env vars and POSTs to `create-checkout`. What's needed on the backend:

1. **`create-checkout` Edge Function**: create a Stripe Checkout Session with `mode: 'subscription'`, `success_url` appending `?upgraded=1`, `client_reference_id` set to the Supabase user UID
2. **Stripe webhook Edge Function**: handle `checkout.session.completed` and `customer.subscription.updated/deleted` → update `profiles.tier` in Supabase
3. **`profiles` table** needs: `tier text default 'free'`, `stripe_customer_id text`
4. Post-upgrade detection via `?upgraded=1` is already wired in `App.jsx` — calls `refreshProfile()`

---

## Behavioural guidelines

**Think Before Coding** — state assumptions explicitly; present multiple interpretations rather than picking silently; ask before implementing when unclear.

**Simplicity First** — minimum code that solves the problem; no speculative features or abstractions for single-use code.

**Surgical Changes** — touch only what the task requires; match existing style; remove only imports/variables that *your* changes made unused.

**Goal-Driven Execution** — transform tasks into verifiable goals; state a brief plan with verify steps for multi-step work before starting.
