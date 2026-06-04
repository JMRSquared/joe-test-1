import { useEffect, useRef, useState } from 'react';

interface ParallaxBandProps {
  /** Background image URL or CSS gradient string */
  background: string;
  children: React.ReactNode;
  index: number;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function ParallaxBand({ background, children, index }: ParallaxBandProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const prefersReduced = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (prefersReduced.current) return;

    const el = containerRef.current;
    if (!el) return;

    function handleScroll() {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const relativeScroll = (viewportH - rect.top) / (viewportH + rect.height);
      const raw = (relativeScroll - 0.5) * 2; // -1 to +1
      setOffset(raw);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgStyle = prefersReduced.current
    ? { background }
    : {
        background,
        transform: `translateY(${offset * 80}px)`,
        scale: 1.1,
      };

  const contentStyle = prefersReduced.current
    ? {}
    : { transform: `translateY(${offset * 24}px)` };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[480px] overflow-hidden md:min-h-[600px]"
      data-testid={`parallax-band-${index}`}
    >
      {/* Background layer — 0.35x scroll rate via CSS */}
      <div
        className="absolute inset-0 will-change-transform"
        style={bgStyle}
        aria-hidden
      />
      {/* Content layer — 0.15x scroll rate */}
      <div
        className="relative z-10 flex min-h-[480px] items-center justify-center md:min-h-[600px]"
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
}