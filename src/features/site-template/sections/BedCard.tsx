import { useEffect, useRef, useState } from 'react';

import type { BedListing } from '../content';

interface BedCardProps {
  bed: BedListing;
  index: number;
}

const TAG_COLORS: Record<BedListing['tag'], string> = {
  'Best Seller': 'bg-amber-100 text-amber-900',
  New: 'bg-emerald-100 text-emerald-900',
  Sale: 'bg-rose-100 text-rose-900',
  'Editor Pick': 'bg-violet-100 text-violet-900',
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function CountUpPrice({ target, seed }: { target: number; seed: number }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const duration = 600;

  useEffect(() => {
    const delay = seededRandom(seed) * 200; // stagger 0-200ms per card
    const timeoutId = setTimeout(() => {
      function tick(timestamp: number) {
        if (startRef.current === null) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setDisplayed(Math.round(target * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, seed]);

  return <span>${displayed.toLocaleString()}</span>;
}

export function BedCard({ bed, index }: BedCardProps) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900 shadow-xl transition-shadow hover:shadow-2xl"
      data-testid={`bed-card-${bed.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
        <img
          src={bed.imageUrl}
          alt={bed.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Tag badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${TAG_COLORS[bed.tag]}`}
        >
          {bed.tag}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Rating row */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-3.5 w-3.5 ${star <= Math.round(bed.rating) ? 'fill-amber-400 text-amber-400' : 'fill-zinc-600 text-zinc-600'}`}
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-zinc-400">
            {bed.rating} ({bed.reviewCount})
          </span>
        </div>

        {/* Name + subtitle */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">{bed.name}</h3>
          <p className="mt-0.5 text-sm text-zinc-400">{bed.subtitle}</p>
        </div>

        {/* Price + CTA */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xl font-bold text-white">
            <CountUpPrice target={bed.basePrice} seed={index} />
          </p>
          <button
            data-testid={`add-to-cart-${bed.id}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}