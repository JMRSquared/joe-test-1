# Design Spec — joe-test-1-08z.3: Queen Beds Pricing Page

## Goal
A dedicated `/pricing` route displaying queen-size bed listings with a **black-themed** aesthetic and **parallax scroll** effect. Users browse beds, see randomized prices, and tap CTAs. The page lives inside the existing `site-template` structure and inherits the black theme from sibling beads `08z.1` (1.5× font scale) and `08z.2` (black palette swap).

---

## Surfaces touched

| File | Role |
|---|---|
| `src/features/site-template/sections/PricingSection.tsx` | New section — the pricing page body |
| `src/features/site-template/content.ts` | New content: bed listings, pricing data |
| `src/App.tsx` | Add `PricingSection` to single-page layout |
| `src/index.css` | (updated by bead `08z.2`) — background/gradient tokens updated to black palette |
| `tailwind.config.js` | (updated by bead `08z.2`) — `primary-*` replaced with black/charcoal scale |

> **Note:** bead `08z.3` spec assumes beads `08z.1` (1.5× font) and `08z.2` (black theme) are **merged first**. The spec below describes the final state after those changes.

---

## Layout sketch

```
┌──────────────────────────────────────────────────────────┐
│  HEADER  (fixed, black/dark — see bead 08z.2)             │
├──────────────────────────────────────────────────────────┤
│  PARALLAX ZONE A — Hero banner                           │
│  "Queen Beds — Premium Collection"                       │
│  full-width, dark bg, text-white, parallax-bg layer      │
│  height: 60vh min; bg-image or gradient offset on scroll │
├──────────────────────────────────────────────────────────┤
│  PRICING GRID — 2-col mobile, 3-col tablet, 4-col desk   │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐          │
│  │ Bed    │  │ Bed    │  │ Bed    │  │ Bed    │          │
│  │ Card   │  │ Card   │  │ Card   │  │ Card   │          │
│  └────────┘  └────────┘  └────────┘  └────────┘          │
│  repeat 6–8 cards (mock data)                            │
├──────────────────────────────────────────────────────────┤
│  PARALLAX ZONE B — "Comfort Redefined" editorial band    │
│  full-width, dark bg, short copy, offset on scroll       │
├──────────────────────────────────────────────────────────┤
│  FOOTER  (existing FooterSection)                        │
└──────────────────────────────────────────────────────────┘
```

---

## Navigation: new route or SPA section?

**Decision: SPA section on the homepage (`/`).** The `HeaderSection` nav links in `navigationSections` gain a `pricing` entry. Clicking scrolls to `#pricing` anchor or renders `PricingSection` within the SPA. This avoids a route change while keeping the pricing experience distinct.

```ts
// navigationSections addition (content.ts)
{ id: 'pricing', label: 'Pricing' },
```

---

## Components used

| Name | Source | Variant / Notes |
|---|---|---|
| `HeaderSection` | `packages/ui` / existing | unchanged — inherits black theme tokens |
| `PricingSection` | **NEW** — `@/features/site-template/sections/PricingSection` | Main pricing page section |
| `BedCard` | **NEW** — inline component inside `PricingSection` | Card for individual bed listing |
| `ParallaxBand` | **NEW** — inline component inside `PricingSection` | Reusable parallax editorial band |
| `FooterSection` | existing | unchanged |
| `CtaSection` | existing | unchanged |

---

## BedCard component

### Props
```ts
interface BedCardProps {
  name: string;
  subtitle: string;
  imageUrl: string;        // placeholder via picsum.photos
  basePrice: number;        // deterministic base, not truly random
  tag?: string;            // e.g. "Best Seller", "New", "Sale"
  rating?: number;          // 0–5 stars
  reviewCount?: number;
}
```

### Visual anatomy
```
┌─────────────────────────────────┐
│ [image — 16:10 aspect ratio]    │
│ [tag badge — top-left overlay]   │
├─────────────────────────────────┤
│ ★★★★☆  (128 reviews)           │
│ Product Name                    │
│ Subtitle / material             │
│                                 │
│ $1,299  ← animated on mount     │
│ [ Add to Cart → ]               │
└─────────────────────────────────┘
```

### States

| State | Behaviour |
|---|---|
| **Default** | White card, `ring-1 ring-slate-800/10`, shadow-sm |
| **Hover** | `shadow-xl ring-1 ring-slate-700/20`, card lifts `-translate-y-1` via Framer Motion |
| **Active/press** | `scale-95` on button tap |
| **Loading** | Skeleton shimmer — rounded rect image block + 4 text lines |
| **Empty** | N/A (static data) |
| **Error** | N/A (static data) |

### Price animation on mount
On component mount, price counts up from `$0` to the final value over **600 ms** with `easeOut` using a Framer Motion `animate` on a `<motion.span>`. No interval/random refresh — price is deterministic per card (seeded from index).

---

## ParallaxBand component

A full-width editorial strip between pricing grid sections.

```ts
interface ParallaxBandProps {
  heading: string;
  subheading?: string;
  bgImageUrl?: string;   // optional; fallback = dark gradient
}
```

### Parallax behaviour
- **Implementation: Framer Motion `useScroll` + `useTransform`** — no CSS-only fallback needed (Framer is already in the stack).
- The band has two layers: a `motion.div` (bg) that moves at `0.35×` scroll rate, and a `motion.div` (content) that moves at `0.15×`.
- `useScroll({ target: sectionRef, offset: ["start end", "end start"] })`.
- `overflow: hidden` on the section; bg layer translates `y` from `[-40px, 40px]` and content `y` from `[-20px, 20px]`.

### Visual
- Background: `bg-slate-950` (updated palette from bead `08z.2`) or `bg-gradient-to-br from-slate-900 to-slate-950`.
- Heading: `text-white`, `font-bold`, `text-3xl–text-5xl` at 1.5× scale.
- Subheading: `text-slate-400`, `text-base–text-lg`.

---

## PricingSection — full component

### Props
None (self-contained, reads from `content.ts`).

### Structure
```
<section id="pricing">
  ParallaxBand A  ("Queen Beds — Premium Collection", tagline)
  Grid container  (BedCard × N)
  ParallaxBand B  ("Comfort Redefined", editorial copy)
  Grid container  (BedCard × N — second row, 4 more)
</section>
```

### Grid
- Mobile: `grid-cols-1`, gap `gap-6`
- Tablet: `sm:grid-cols-2`, gap `gap-6`
- Desktop: `lg:grid-cols-3`, gap `gap-8`
- Wide: `xl:grid-cols-4`

### Entrance animation
`useInView` with `once: true, margin: "-100px"`. Cards stagger: `delay = index * 0.08 s`. Animate: `opacity 0→1`, `y: 24→0`, `duration: 0.45 s`, `ease: easeOut`.

---

## Tokens (Tailwind — final state after bead `08z.2`)

The black palette from bead `08z.2` replaces `primary-*` with:

| Token | Value | Usage |
|---|---|---|
| `slate-950` | `#020617` | Page bg, parallax bands, dark sections |
| `slate-900` | `#0f172a` | Card bg in dark contexts |
| `slate-800` | `#1e293b` | Borders, rings in dark mode |
| `slate-400` | `#94a3b8` | Secondary text on dark bg |
| `slate-200` | `#e2e8f0` | Body text on dark bg |
| `white` | `#ffffff` | Headings, primary text on dark |
| `zinc-50` | `#fafafa` | Light surface cards |
| `zinc-100` | `#f4f4f5` | Card borders, dividers |

### Existing tokens preserved
`primary-*` removed; replace all `@apply` in `index.css` referencing `primary-*`:
- `.section-eyebrow`: `text-primary-600` → `text-slate-400`
- `::selection` bg: `rgba(59, 130, 246, 0.18)` → `rgba(255, 255, 255, 0.15)`
- Any `bg-primary-*`, `text-primary-*` in sections → equivalent dark token

### New tokens used in `PricingSection`
```css
/* No raw hex. All via Tailwind classes. */
/* Dark bg band */
<section className="bg-slate-950" ...>
/* Card */
<div className="bg-white border border-zinc-200 shadow-sm" ...>
/* Price */
<span className="text-2xl font-bold text-slate-900" ...>
/* Button */
<button className="bg-slate-950 text-white hover:bg-slate-800" ...>
```

---

## Typography (after 1.5× scale from bead `08z.1`)

The 1.5× root scale (`html { font-size: 24px }`) applies globally. Explicit Tailwind sizes scale accordingly:

| Element | Tailwind class | Effective size (after 1.5×) |
|---|---|---|
| Parallax heading | `text-4xl` → `text-5xl` (lg) | `2rem → 3rem` |
| Card name | `text-lg font-semibold` | `1.125rem` |
| Price | `text-2xl font-bold` | `1.5rem` |
| Eyebrow | `text-sm uppercase` | `0.875rem` |

Font: `Inter` (unchanged from base).

---

## States — full surface checklist

| Surface | Loading | Empty | Error |
|---|---|---|---|
| **BedCard** | Shimmer skeleton (image rect + 4 text lines) | N/A | N/A |
| **Pricing grid** | All 8 cards in skeleton state | N/A | N/A |
| **ParallaxBand** | No loading state — static copy | N/A | N/A |
| **Add to Cart button** | Disabled + spinner on click | — | — |

---

## Accessibility

| Rule | Implementation |
|---|---|
| Contrast | Dark text on white cards: `slate-900`/`slate-950` on `white` = >7:1 ✓ |
| Focus order | Tab through cards left→right, top→bottom; focus ring `outline-none ring-2 ring-slate-400 ring-offset-2` |
| Keyboard nav | Space/Enter on card buttons; `aria-label` on Add to Cart |
| Screen reader | `aria-label="Add [product name] to cart"` on each CTA |
| Reduced motion | `prefers-reduced-motion: reduce` — disable parallax `useScroll` transforms, use simple fade only |
| Images | `alt="Queen bed — [product name]"` on all bed images |

---

## Responsive behaviour

| Breakpoint | Grid cols | Parallax | Header nav |
|---|---|---|---|
| Mobile `<640px` | 1 col | disabled (no parallax), fade-only | hamburger menu |
| Tablet `640–1023px` | 2 cols | reduced offset range (`±20px`) | hamburger |
| Desktop `≥1024px` | 3 cols | full `±40px` | inline links |
| Wide `≥1280px` | 4 cols | full | inline |

---

## Open questions

1. **Route vs SPA**: Spec opts for SPA section — confirm with PO/dev if a dedicated `/pricing` URL is required for SEO/sharing.
2. **Image source**: Use `picsum.photos/seed/bed-{n}/600/480` for deterministic placeholder images. Confirm if real bed product images are available.
3. **Add to Cart destination**: No cart/back-end exists. CTA should link to `#` with `aria-disabled` or a `mailto:` placeholder. Confirm expected behaviour.
4. **Price randomization**: Spec uses deterministic seeded prices (no true randomness). Confirm this is acceptable or if a client-side randomizer is needed.
5. **How many cards**: Spec targets 8 cards (2 rows of 4). Adjust count based on content volume.