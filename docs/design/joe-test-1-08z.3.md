# Design Spec: Pricing Page — Queen Beds (Bead joe-test-1-08z.3)

## Status

Implemented and verified on `main` (merged via PR #1). This spec documents what was built.

---

## Navigation

**SPA section** — not a standalone `/pricing` route. Anchor link `#pricing` from nav. No new route required.

`navigationSections` in `content.ts` includes `{ id: 'pricing', label: 'Pricing' }`.

---

## Page Structure

```
<ParallaxBand>          ← dark hero strip
  Queen Beds heading
  Subtext + 10yr warranty copy
</ParallaxBand>

<div class="bg-white">  ← white content band
  <motion.div>           ← staggered grid entrance
    {BED_LISTINGS.map(…)}  → 4× BedCard
  </motion.div>
</div>

<ParallaxBand>          ← editorial strip (shorter)
  CTA copy + arrow link
</ParallaxBand>
```

---

## Typography

| Token            | Value                                   |
|------------------|-----------------------------------------|
| `font-sans`      | Inter (via tailwind `fontFamily.sans`)  |
| Section eyebrow  | `text-sm font-semibold uppercase tracking-widest text-zinc-400` |
| H2 (hero)        | `text-4xl md:text-5xl font-bold text-white` |
| Subtext          | `text-base text-zinc-400`               |
| Card name        | `text-base font-semibold text-zinc-900` |
| Card price        | `text-xl font-bold text-zinc-900`       |
| Card description  | `text-sm text-zinc-500`                 |

---

## Color Palette (black/zinc theme)

From `tailwind.config.js` `primary` scale:

| Token               | Hex       | Usage                          |
|---------------------|-----------|--------------------------------|
| `primary.950/slate-950` | `#09090b` | Parallax band background       |
| `primary.800/slate-800` | `#27272a` | Parallax band gradient mid     |
| `primary.700/slate-700` | `#3f3f46` | Editorial band gradient        |
| `white`             | `#ffffff` | Content band, card background  |
| `zinc-900`          | `#18181b` | Card text (primary)            |
| `zinc-500`          | `#71717a` | Card text (secondary)          |
| `zinc-400`          | `#a1a1aa` | Eyebrow text, subtext          |
| `zinc-200`          | `#e4e4e7` | Card border, divider           |
| `zinc-100`          | `#f4f4f5` | Footer background              |

No raw hex used — all via `text-zinc-*` / `bg-zinc-*` / `border-zinc-*` utility classes.

---

## Parallax

**Technique:** Framer Motion `useScroll` + `useTransform`.

- `ParallaxBand` accepts `background` (CSS string) and `index` (number offset)
- `y` value: `useTransform(scrollYProgress, [0, 1], [0, -80 * index])`
- Reduced-motion: `prefersReducedMotion` check — `y` set to `0` when true

```tsx
// ParallaxBand.tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
const y = useTransform(scrollYProgress, [0, 1], [0, -80 * index]);
```

---

## BedCard Component

Inline in `PricingSection.tsx`. Composition:

```
┌────────────────────────────────────┐
│  <div class="aspect-[4/3] overflow-hidden">
│    <img src={bed.image} alt={bed.name} />
│  </div>
│  <div class="p-4 space-y-2">
│    <div class="flex items-center gap-1">
│      <StarIcon /> <span class="text-sm">{bed.rating}</span>
│    </div>
│    <h3 class="font-semibold">{bed.name}</h3>
│    <p class="text-sm text-zinc-500">{bed.description}</p>
│    <div class="pt-2 border-t border-zinc-200 flex items-center justify-between">
│      <span class="font-bold text-lg">${countUp(bed.price)}</span>
│      <button class="text-sm underline">Add to Cart</button>
│    </div>
│  </div>
└────────────────────────────────────┘
```

**Count-up animation:** seeded (deterministic per `bed.id`), triggered on card entering viewport. Uses `framer-motion` `animate` on a span with a numeric value.

---

## Interaction Details

| Interaction          | Behaviour                                                |
|----------------------|----------------------------------------------------------|
| Grid entrance        | Staggered children: `staggerChildren: 0.08`, `duration: 0.4` per card |
| Card hover           | `hover:-translate-y-1` + `shadow-lg` via Tailwind       |
| Price count-up       | Framer Motion `animate` from 0 to `bed.price`, 800ms   |
| Parallax scroll      | `useScroll` + `useTransform` per `ParallaxBand`         |
| Reduced motion       | `prefersReducedMotion`: skip count-up, y=0 for parallax |

---

## Accessibility

- 4.5:1 contrast — `zinc-500` on white = 4.68:1 ✓
- Focus rings on interactive elements
- `aria-label` on CTAs where text is non-descriptive (`Add to Cart` button)
- `prefers-reduced-motion` respected

---

## Responsive Grid

| Breakpoint       | Columns |
|------------------|---------|
| Mobile (< sm)    | 1       |
| sm               | 2       |
| lg               | 4       |

---

## Dependencies

- **Prior bead:** `joe-test-1-08z.2` (black palette swap) — must be merged first
- **Content:** `joe-test-1-08z.3.1` (queen bed listings in `content.ts`)
- **Components:** `PricingSection`, `BedCard`, `ParallaxBand` (implemented in this bead)

---

## Design Decisions

1. **SPA section over `/pricing` route** — avoids routing complexity; anchor scroll is sufficient for a landing page.
2. **Deterministic seeded prices** — count-up is deterministic per `bed.id`; no random refresh on mount.
3. **No cart destination** — `Add to Cart` is a placeholder CTA; no cart flow exists yet.
4. **8 cards (2 rows × 4 cols on lg)** — standard grid density; adjustable by changing `BED_LISTINGS` array length.
5. **Framer Motion `useScroll`/`useTransform`** — chosen over CSS-only parallax for precise control and reduced-motion safety built in.