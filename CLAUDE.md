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

---

## Design language

This app has a strong, established visual identity. Preserve it exactly unless a change explicitly requires deviation.

### Palette

Dark warm background — `oklch(9% 0.008 60)` with two subtle radial glows baked into `body` (amber bottom-left, blue top-right). Never flatten this to plain black.

```
Surface scale (darkest → lightest):
--surface-0   oklch(9% 0.008 60)   body / deepest bg
--surface-1   oklch(12% 0.008 60)  cards
--surface-2   oklch(15% 0.008 60)  elevated surfaces, tooltip bg
--border      oklch(18% 0.006 60)  all dividers and outlines

Text scale:
--text        oklch(88% 0.01 75)   primary — headings, key values
--text-dim    oklch(67% 0.01 75)   secondary — body prose, sub-labels
--text-muted  oklch(60% 0.008 75)  tertiary — metadata, timestamps, hints

Accent:
--jade        oklch(60% 0.11 162)  current/active states, focus rings
--jade-dim    oklch(38% 0.07 162)  jade borders
--jade-bg     oklch(13% 0.04 162)  jade tinted backgrounds
```

Element colour tokens (JS only — never hardcode in CSS):
```
ELEM.Wood   #6abf7a   glow rgba(106,191,122,0.22)
ELEM.Fire   #d96b54   glow rgba(217,107,84,0.22)
ELEM.Earth  #c4913a   glow rgba(196,145,58,0.22)   ← also the gold accent / premium colour
ELEM.Metal  #9db0c2   glow rgba(157,176,194,0.18)
ELEM.Water  #5592b8   glow rgba(85,146,184,0.22)
```

Rule: **text and surface colours always use CSS variables. Element hex values live in `ELEM` in `constants.js` and are used directly in inline `style` props.**

### Typography

Three fonts, never mixed within a semantic role:

| Role | Variable | Font | Usage |
|------|----------|------|-------|
| Display | `var(--font-display)` | Fraunces (serif, italic at large sizes) | Section headings, hero text, prose body |
| Data/Label | `var(--font-mono)` | JetBrains Mono | All caps labels, scores, IDs, timestamps, badges |
| CJK | `var(--font-cjk)` | Noto Serif SC | Chinese characters only — stems, branches, element labels |

Label convention: monospace, font-size 7–10px, `letter-spacing: 0.14–0.22em`, `text-transform: uppercase`. These are the "instrument panel" labels throughout the UI.

Heading convention: Fraunces, `font-weight: 300`, `font-style: italic` at large sizes (28px+). Never bold headings.

### Spacing

4px base unit. All padding, gap, and margin values must be multiples of 4. Common values: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80.

### Component patterns

**Cards**: `background: var(--surface-1)`, `border: 1px solid var(--border)`. Add `.card-hover` class for hover lift effect. No box-shadow at rest.

**Section dividers**: thin 1px `var(--border)` line with centred label text. See `SectionDivider` pattern used across screens.

**Badges/chips**: monospace, 7–9px, `letter-spacing: 0.14–0.16em`, uppercase, coloured background at ~8% opacity with matching border at ~20% opacity.

**Loading**: always `.skeleton-line` (grey pulsing block matching text width), never a spinner. The sole exception is the full-screen chart-calculation transition in `App.jsx`.

**Tooltips**: `@radix-ui/react-tooltip` with `background: var(--surface-2)`, `border: 1px solid var(--border)`. `TooltipProvider` lives at root in `main.jsx`.

**Modals**: `@radix-ui/react-dialog`. Overlay: `rgba(7,7,9,0.88)` + `backdrop-filter: blur(8px)`. Content: `var(--surface-1)` with `var(--border)`.

### Responsive breakpoints

- `≥ 640px`: full desktop layout
- `< 640px`: Four Pillars grid → 2×2 (`pillar-grid` class), Luck Cycle timeline → vertical card stack (`.luck-timeline` / `.luck-pillar-btn` classes), screen padding drops from 64px to 20px (`.screen-container` class)

---

## Stripe / subscription

The frontend is fully wired — `PricingPage` reads price IDs from env vars and POSTs to `create-checkout`. What's needed on the backend:

1. **`create-checkout` Edge Function**: Stripe Checkout Session with `mode: 'subscription'`, `success_url` appending `?upgraded=1`, `client_reference_id` = Supabase user UID
2. **Stripe webhook Edge Function**: handle `checkout.session.completed` and `customer.subscription.updated/deleted` → update `profiles.tier` in Supabase
3. **`profiles` table** needs: `tier text default 'free'`, `stripe_customer_id text`
4. Post-upgrade detection via `?upgraded=1` is already wired in `App.jsx` — calls `refreshProfile()`

---

## Behavioural guidelines

**Think Before Coding** — state assumptions explicitly; present multiple interpretations rather than picking silently; ask before implementing when unclear.

**Simplicity First** — minimum code that solves the problem; no speculative features or abstractions for single-use code.

**Surgical Changes** — touch only what the task requires; match existing style; remove only imports/variables that *your* changes made unused.

**Goal-Driven Execution** — transform tasks into verifiable goals; state a brief plan with verify steps for multi-step work before starting.
