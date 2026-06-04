import { Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { pricingBeds, type BedProduct } from '../content';

// ── Utilities ───────────────────────────────────────────────────────────────

/** Seeded price variation so prices are deterministic per card index. */
function seededPrice(base: number, seed: number): number {
  const variance = Math.sin(seed * 9301 + 49297) * 0.12;
  return Math.round(base * (1 + variance));
}

// ── PriceCountUp ─────────────────────────────────────────────────────────────

interface PriceCountUpProps {
  target: number;
  prefix?: string;
  testId?: string;
}

function PriceCountUp({ target, prefix = '$', testId }: PriceCountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [target]);

  return (
    <motion.span
      data-testid={testId}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      {display.toLocaleString()}
    </motion.span>
  );
}

// ── StarRating ───────────────────────────────────────────────────────────────

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-500">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="tabular-nums">
        {rating.toFixed(1)} ({reviewCount.toLocaleString()} reviews)
      </span>
    </div>
  );
}

// ── BedCard ──────────────────────────────────────────────────────────────────

interface BedCardProps extends BedProduct {
  /** Index used for entrance stagger and price seed. */
  index: number;
}

export function BedCard({ name, subtitle, basePrice, imageSeed, tag, rating, reviewCount, index }: BedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-60px' });
  const price = seededPrice(basePrice, index + 1);

  const imgUrl = `https://picsum.photos/seed/${imageSeed}/600/480`;

  return (
    <motion.div
      ref={cardRef}
      data-testid="bed-card"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imgUrl}
          alt={`Queen bed — ${name}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {tag && (
          <span className="absolute top-3 left-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white">
            {tag}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <StarRating rating={rating} reviewCount={reviewCount} />

        <h3
          data-testid="bed-card-name"
          className="text-lg font-semibold text-slate-900"
        >
          {name}
        </h3>
        <p className="text-sm text-slate-500">{subtitle}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span
            data-testid="bed-card-price"
            className="text-2xl font-bold text-slate-950"
          >
            <PriceCountUp target={price} testId="bed-card-price" />
          </span>

          <button
            onClick={() => {
              // No cart exists — placeholder behaviour
            }}
            aria-label={`Add ${name} to cart`}
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── ParallaxBand ─────────────────────────────────────────────────────────────

interface ParallaxBandProps {
  heading: string;
  subheading?: string;
  bgImageUrl?: string;
  /** Test id for BDD steps */
  testId?: string;
  className?: string;
}

export function ParallaxBand({ heading, subheading, bgImageUrl, testId, className }: ParallaxBandProps) {
  const ref = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial value depends on browser API
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-40px', '40px']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['-20px', '20px']);

  return (
    <section
      ref={ref}
      data-testid={testId}
      className={`relative overflow-hidden bg-slate-950 ${className ?? ''}`}
    >
      {bgImageUrl && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={reducedMotion ? {} : { y: bgY, backgroundImage: `url(${bgImageUrl})` }}
          aria-hidden="true"
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <motion.div
          className="text-center"
          style={reducedMotion ? {} : { y: contentY }}
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl">{heading}</h2>
          {subheading && (
            <p className="mt-4 text-lg text-slate-400 sm:text-xl">{subheading}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ── PricingSection ────────────────────────────────────────────────────────────

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Split beds into two rows of 4
  const row1 = pricingBeds.slice(0, 4);
  const row2 = pricingBeds.slice(4, 8);

  return (
    <section id="pricing" ref={sectionRef} aria-label="Queen beds pricing">
      {/* Hero ParallaxBand */}
      <ParallaxBand
        testId="parallax-band-hero"
        heading="Queen Beds"
        subheading="Premium collection — crafted for lasting comfort"
        className="py-32 sm:py-40"
      />

      {/* Row 1 grid */}
      <div className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {row1.map((bed, i) => (
              <BedCard key={bed.name} {...bed} index={i} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Editorial ParallaxBand */}
      <ParallaxBand
        testId="parallax-band-editorial"
        heading="Comfort Redefined"
        subheading="Every detail considered. Every night elevated."
        className="py-24 sm:py-32"
      />

      {/* Row 2 grid */}
      <div className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {row2.map((bed, i) => (
              <BedCard key={bed.name} {...bed} index={i + 4} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}