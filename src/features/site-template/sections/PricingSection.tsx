import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

import { BED_LISTINGS } from '../content';
import { BedCard } from './BedCard';
import { ParallaxBand } from './ParallaxBand';

const BG_HERO = 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)';
const BG_EDITORIAL = 'linear-gradient(135deg, #3f3f46 0%, #27272a 60%, #18181b 100%)';

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export function PricingSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-80px' });

  return (
    <section id="pricing" className="w-full">
      {/* Hero parallax band */}
      <ParallaxBand background={BG_HERO} index={1}>
        <div className="px-6 py-20 text-center md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">Queen Beds</p>
          <h2 className="mx-auto max-w-3xl text-4xl font-bold text-white md:text-5xl">
            Find Your Perfect Night's Sleep
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
            Expert-designed for support, comfort, and durability — each mattress backed by a 10-year warranty.
          </p>
        </div>
      </ParallaxBand>

      {/* Bed grid */}
      <div className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            ref={gridRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={gridVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {BED_LISTINGS.map((bed, i) => (
              <motion.div key={bed.id} variants={cardVariants}>
                <BedCard bed={bed} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Editorial parallax band */}
      <ParallaxBand background={BG_EDITORIAL} index={2}>
        <div className="px-6 py-20 text-center md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Sleep Trial</p>
          <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            100-Night Risk-Free Trial
          </h3>
          <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400">
            Sleep on it for up to 100 nights. If it is not right, we will pick it up and refund you in full — no questions asked.
          </p>
        </div>
      </ParallaxBand>
    </section>
  );
}