import { describe, it, expect, afterEach } from '@jest/globals';
import { render, screen, act, cleanup } from '@testing-library/react';

import { BedCard, ParallaxBand, PricingSection } from '../sections/PricingSection';
import { pricingBeds } from '../content';

describe('PricingSection', () => {
  afterEach(() => {
    cleanup();
  });

  describe('smoke', () => {
    it('renders hero heading "Queen Beds"', () => {
      render(<PricingSection />);
      expect(screen.getByRole('heading', { name: /queen beds/i })).toBeInTheDocument();
    });

    it('renders at least 4 BedCard components', () => {
      render(<PricingSection />);
      const cards = document.querySelectorAll('[data-testid="bed-card"]');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    it('each BedCard shows name, price, and Add to Cart button', () => {
      render(<PricingSection />);
      const cards = document.querySelectorAll('[data-testid="bed-card"]');
      expect(cards.length).toBeGreaterThanOrEqual(1);
      cards.forEach((card) => {
        expect(card.querySelector('[data-testid="bed-card-name"]')).not.toBeNull();
        expect(card.querySelector('[data-testid="bed-card-price"]')).not.toBeNull();
        const btn = card.querySelector('button');
        expect(btn).not.toBeNull();
        expect(btn?.textContent?.toLowerCase()).toContain('add to cart');
      });
    });
  });

  describe('ParallaxBand', () => {
    it('renders heading and subheading', () => {
      render(<ParallaxBand heading="Test Heading" subheading="Test sub" testId="band-1" />);
      expect(screen.getByRole('heading', { name: 'Test Heading' })).toBeInTheDocument();
      expect(screen.getByText('Test sub')).toBeInTheDocument();
    });

    it('applies dark background class', () => {
      const { container } = render(<ParallaxBand heading="Dark" testId="band-2" />);
      expect(container.querySelector('[data-testid="band-2"]')).toHaveClass('bg-slate-950');
    });

    it('respects prefers-reduced-motion — no inline transform', () => {
      const orig = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }),
      });

      const { container } = render(<ParallaxBand heading="Reduced" testId="band-3" />);
      const section = container.querySelector('[data-testid="band-3"]');
      // When reduced-motion: no transform style
      expect(section?.getAttribute('style') ?? '').not.toContain('transform');

      Object.defineProperty(window, 'matchMedia', { writable: true, value: orig });
    });
  });

  describe('BedCard', () => {
    const bed = pricingBeds[0];

    it('shows image with descriptive alt text', () => {
      render(<BedCard {...bed} index={0} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', expect.stringContaining('Queen bed'));
    });

    it('shows product name via testid', () => {
      render(<BedCard {...bed} index={0} />);
      expect(screen.getByTestId('bed-card-name')).toHaveTextContent(bed.name);
    });

    it('animates price count-up from $0 to final value', async () => {
      render(<BedCard {...bed} index={0} />);
      // getAllByTestId — motion.span also carries data-testid from the mock
      const priceEls = screen.getAllByTestId('bed-card-price');
      const priceEl = priceEls[priceEls.length - 1]; // innermost span
      expect(priceEl.textContent).toBe('$0');
      await act(() => new Promise((r) => setTimeout(r, 800)));
      expect(priceEl.textContent).not.toBe('$0');
    });

    it('Add to Cart button has accessible aria-label', () => {
      render(<BedCard {...bed} index={0} />);
      const btn = screen.getByRole('button');
      expect(btn).toHaveAttribute('aria-label', `Add ${bed.name} to cart`);
    });

    it('shows tag badge when provided', () => {
      render(<BedCard {...bed} index={0} />);
      expect(screen.getByText('Best Seller')).toBeInTheDocument();
    });

    it('shows star rating', () => {
      render(<BedCard {...bed} index={0} />);
      expect(screen.getByText(/4\.8/)).toBeInTheDocument();
    });
  });

  describe('navigation section', () => {
    it('section has id="pricing" for anchor linking', () => {
      render(<PricingSection />);
      expect(document.getElementById('pricing')).not.toBeNull();
    });
  });

  describe('responsive grid', () => {
    it('grid has correct responsive column classes', () => {
      render(<PricingSection />);
      const grids = document.querySelectorAll('#pricing .grid');
      expect(grids.length).toBeGreaterThanOrEqual(1);
      grids.forEach((grid) => {
        expect(grid).toHaveClass('sm:grid-cols-2');
        expect(grid).toHaveClass('lg:grid-cols-3');
        expect(grid).toHaveClass('xl:grid-cols-4');
      });
    });
  });
});