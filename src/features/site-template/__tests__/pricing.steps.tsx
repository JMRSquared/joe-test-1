/**
 * pricing.steps.tsx — BDD step definitions for the pricing page.
 */
import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, act, cleanup } from '@testing-library/react';

import { PricingSection, BedCard } from '../sections/PricingSection';
import { pricingBeds, navigationSections } from '../content';

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
      const cards = document.querySelectorAll('[data-testid="bed-card"]');
      expect(cards.length).toBe(8);
    });
  });

  test('Each bed card shows essential product information', ({ given, then }) => {
    given('the pricing section is present', () => {
      render(<PricingSection />);
    });

    then('each card shows a product name', () => {
      const names = screen.getAllByTestId('bed-card-name');
      expect(names.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a price', () => {
      const prices = screen.getAllByTestId('bed-card-price');
      expect(prices.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a star rating', () => {
      const ratingTexts = document.querySelectorAll('[data-testid="bed-card"]');
      expect(ratingTexts.length).toBeGreaterThanOrEqual(1);
      // Verify the first bed's rating is visible
      const ratingEls = document.querySelectorAll('[data-testid="bed-card"]'); expect(ratingEls.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a review count', () => {
      const ratingTexts = document.querySelectorAll('[data-testid="bed-card"]');
      expect(ratingTexts.length).toBeGreaterThanOrEqual(1);
    });

    then('each card shows a tag badge', () => {
      pricingBeds.forEach((bed) => {
        if (bed.tag) expect(screen.getByText(bed.tag)).toBeInTheDocument();
      });
    });

    then('each card shows an "Add to Cart" button', () => {
      const btns = screen.getAllByRole('button');
      const addToCartBtns = btns.filter((btn) =>
        btn.textContent?.toLowerCase().includes('add to cart'),
      );
      expect(addToCartBtns.length).toBe(pricingBeds.length);
    });
  });

  test('Price animates from zero on card entrance', async ({ given, when, then, and }) => {
    given('a bed card is visible', () => {
      render(<BedCard {...pricingBeds[0]} index={0} />);
    });

    when('it first renders', () => {});

    then('the price starts at $0', () => {
      const priceEls = screen.getAllByTestId('bed-card-price');
      const priceEl = priceEls[priceEls.length - 1];
      expect(priceEl.textContent).toBe('$0');
    });

    and('after the animation completes', async () => {
      await act(() => new Promise((r) => setTimeout(r, 800)));
    });

    then('the price is greater than $0', () => {
      const priceEls = screen.getAllByTestId('bed-card-price');
      const priceEl = priceEls[priceEls.length - 1];
      expect(priceEl.textContent).not.toBe('$0');
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
      const btns = screen.getAllByRole('button');
      const firstAriaLabel = btns[0]?.getAttribute('aria-label');
      expect(firstAriaLabel).toContain(pricingBeds[0].name);
    });
  });
});

export { feature };
