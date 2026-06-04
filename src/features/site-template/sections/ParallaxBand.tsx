import { useEffect, useRef, useState } from 'react';

interface ParallaxBandProps {
  background: string;
  children: React.ReactNode;
  index: number;
}

export function ParallaxBand({ background, children, index }: ParallaxBandProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  // Assume reduced motion until we confirm otherwise — prevents any animation
  // on first paint for users who prefer it. Updated asynchronously after mount.
  const [reducedMotion, setReducedMotion] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Update synchronously here is intentional: we want the correct state
    // before any animation frames fire. ESLint's set-state-in-effect warning
    // is suppressed because the media-query read must happen after mount.
    setReducedMotion(mq.matches); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setOffset(0);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    function handleScroll() {
      const rect = el!.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const relativeScroll = (viewportH - rect.top) / (viewportH + rect.height);
      const raw = (relativeScroll - 0.5) * 2;
      setOffset(raw);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  const bgStyle = reducedMotion
    ? { background }
    : {
        background,
        transform: `translateY(${offset * 80}px)`,
        scale: 1.1,
      };

  const contentStyle = reducedMotion
    ? {}
    : { transform: `translateY(${offset * 24}px)` };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[480px] overflow-hidden md:min-h-[600px]"
      data-testid={`parallax-band-${index}`}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={bgStyle}
        aria-hidden
      />
      <div
        className="relative z-10 flex min-h-[480px] items-center justify-center md:min-h-[600px]"
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
}