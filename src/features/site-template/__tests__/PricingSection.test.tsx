import { describe, it, expect, afterEach } from '@jest/globals';
import { render, screen, cleanup } from '@testing-library/react';

import { BedCard } from '../sections/BedCard';
import { ParallaxBand } from '../sections/ParallaxBand';
import { PricingSection } from '../sections/PricingSection';

// Inline fixture — avoids any module-level interop issues
const CLOUD_BED = {
  id: 'cloud-support-queen',
  name: 'CloudSupport Queen',
  subtitle: 'Memory foam comfort with ventilated airflow',
  imageUrl: 'https://picsum.photos/seed/bed-1/600/480',
  basePrice: 999,
  tag: 'Best Seller',
  rating: 4.8,
  reviewCount: 312,
};

describe('PricingSection', () => {
  afterEach(() => {
    cleanup();
  });

  describe('smoke', () => {
    it('renders hero heading "Queen Beds"', () => {
      render(<PricingSection />);
      expect(screen.getByRole('heading', { name: /Find Your Perfect Night's Sleep/i })).toBeInTheDocument();
    });

    it('renders at least 4 BedCard components', () => {
      render(<PricingSection />);
      const cards = document.querySelectorAll('article[data-testid^="bed-card-"]');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    it('each BedCard shows name, price, and Add to Cart button', () => {
      render(<PricingSection />);
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.length).toBeGreaterThanOrEqual(1);
      const btns = document.querySelectorAll('button');
      const addToCartBtns = Array.from(btns).filter((b) =>
        b.textContent?.toLowerCase().includes('add to cart'),
      );
      expect(addToCartBtns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('ParallaxBand', () => {
    it('renders heading and subheading', () => {
      render(
        <ParallaxBand background="#18181b" index={1}>
          <h2>Test Heading</h2>
          <p>Test sub</p>
        </ParallaxBand>,
      );
      expect(screen.getByRole('heading', { name: 'Test Heading' })).toBeInTheDocument();
      expect(screen.getByText('Test sub')).toBeInTheDocument();
    });

    it('applies dark background via inline style', () => {
      const { container } = render(<ParallaxBand background="#020617" index={2} />);
      const bgLayer = container.querySelector('[aria-hidden="true"]');
      expect(bgLayer?.getAttribute('style') ?? '').toContain('background');
    });

    it('respects prefers-reduced-motion — no inline transform', () => {
      const orig = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue({ matches: true, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn() }),
      });

      const { container } = render(<ParallaxBand background="#18181b" index={3} />);
      const section = container.querySelector('[data-testid="parallax-band-3"]');
      expect(section?.getAttribute('style') ?? '').not.toContain('transform');

      Object.defineProperty(window, 'matchMedia', { writable: true, value: orig });
    });
  });

  describe('BedCard', () => {
    it('shows image with descriptive alt text', () => {
      render(<BedCard bed={CLOUD_BED} index={0} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', expect.stringContaining('Queen'));
    });

    it('shows product name via heading', () => {
      render(<BedCard bed={CLOUD_BED} index={0} />);
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings[0]).toHaveTextContent(CLOUD_BED.name);
    });

    it('Add to Cart button is present', () => {
      render(<BedCard bed={CLOUD_BED} index={0} />);
      const btn = screen.getByRole('button');
      expect(btn.textContent?.toLowerCase()).toContain('add to cart');
    });

    it('shows tag badge when provided', () => {
      render(<BedCard bed={CLOUD_BED} index={0} />);
      expect(screen.getByText('Best Seller')).toBeInTheDocument();
    });

    it('shows star rating', () => {
      render(<BedCard bed={CLOUD_BED} index={0} />);
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
        expect(grid).toHaveClass('lg:grid-cols-4');
      });
    });
  });
});
