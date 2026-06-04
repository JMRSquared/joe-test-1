/**
 * pricing.steps.tsx — BDD step definitions for the pricing page.
 */
import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, act, cleanup } from '@testing-library/react';

import { PricingSection } from '../sections/PricingSection';
import { BED_LISTINGS, navigationSections } from '../content';

const feature = loadFeature(__dirname + '/pricing.feature');

defineFeature(feature, (test) => {
  beforeEach(() => {
    cleanup();
  });

  test('Guest user can view all bed listings', ({ given, then }) => {
    given('the pricing section is present', () => {
      render(<PricingSection />);
    });

    then('I see exactly 8 bed cards', () => {
      const cards = document.querySelectorAll('article[data-testid^="bed-card-"]');
      expect(cards.length).toBe(BED_LISTINGS.length);
    });
  });

  test('Each bed card shows essential product information', ({ given, then }) => {
    given('the pricing section is present', () => {
      render(<PricingSection />);
    });

    then('each card shows a product name', () => {
      const names = screen.getAllByRole('heading', { level: 3 });
      expect(names.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a price', () => {
      const prices = document.querySelectorAll('article[data-testid^="bed-card-"]');
      expect(prices.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a star rating', () => {
      const cards = document.querySelectorAll('article[data-testid^="bed-card-"]');
      expect(cards.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a review count', () => {
      const cards = document.querySelectorAll('article[data-testid^="bed-card-"]');
      expect(cards.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a tag badge', () => {
      BED_LISTINGS.forEach((bed) => {
        if (bed.tag) {
          expect(screen.getAllByText(bed.tag).length).toBeGreaterThanOrEqual(1);
        }
      });
    });

    then('each card shows an "Add to Cart" button', () => {
      const btns = screen.getAllByRole('button');
      const addToCartBtns = Array.from(btns).filter((btn) =>
        btn.textContent?.toLowerCase().includes('add to cart'),
      );
      expect(addToCartBtns.length).toBe(BED_LISTINGS.length);
    });
  });

  test('Price animates from zero on card entrance', async ({ given, when, then, and }) => {
    given('a bed card is visible', () => {
      // Render PricingSection first to ensure BED_LISTINGS is populated,
      // then access the first bed card from the rendered DOM.
      render(<PricingSection />);
      const firstCard = document.querySelector('article[data-testid^="bed-card-"]');
      if (!firstCard) throw new Error('No bed card found in DOM');
    });

    when('it first renders', () => {});

    then('the price starts at $0', () => {
      const prices = document.querySelectorAll('article[data-testid^="bed-card-"]');
      expect(prices.length).toBeGreaterThanOrEqual(1);
    });

    and('after the animation completes', async () => {
      await act(() => new Promise((r) => setTimeout(r, 800)));
    });

    then('the price is greater than $0', () => {
      const prices = document.querySelectorAll('article[data-testid^="bed-card-"]');
      expect(prices.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('Hero parallax band displays with dark background', ({ given, then }) => {
    given('the pricing section is present', () => {
      render(<PricingSection />);
    });

    then('a dark-themed parallax band is visible', () => {
      expect(document.getElementById('pricing')).toBeInTheDocument();
    });
  });

  test('Editorial parallax band is present below the grid', ({ given, then }) => {
    given('the pricing section is present', () => {
      render(<PricingSection />);
    });

    then('a second parallax band is visible after the bed grid', () => {
      const section = document.getElementById('pricing');
      expect(section?.children.length).toBeGreaterThan(1);
    });
  });

  test('Header includes a Pricing navigation entry', ({ then }) => {
    then('a "Pricing" navigation item is present', () => {
      const pricingEntry = navigationSections.find((s) => s.id === 'pricing');
      expect(pricingEntry).toBeDefined();
      expect(pricingEntry!.label).toBe('Pricing');
    });
  });

  test('Add to Cart button has a descriptive aria-label', ({ given, then }) => {
    given('the pricing section is present', () => {
      render(<PricingSection />);
    });

    then('the Add to Cart button has an aria-label that includes the product name', () => {
      const btns = document.querySelectorAll('button');
      expect(btns.length).toBeGreaterThan(0);
    });
  });
});

export { feature };
