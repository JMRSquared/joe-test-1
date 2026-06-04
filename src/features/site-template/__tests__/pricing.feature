Feature: Pricing Page — Queen Beds

  As a shopper, I want to browse queen bed listings with pricing and ratings,
  so I can make an informed purchase decision.

  Scenario: Guest user can view all bed listings
    Given the pricing section is present
    Then I see exactly 8 bed cards

  Scenario: Each bed card shows essential product information
    Given the pricing section is present
    Then each card shows a product name
    And each card shows a price
    And each card shows a star rating
    And each card shows a review count
    And each card shows a tag badge
    And each card shows an "Add to Cart" button

  Scenario: Price animates from zero on card entrance
    Given a bed card is visible
    When it first renders
    Then the price starts at $0
    And after the animation completes
    Then the price is greater than $0

  Scenario: Hero parallax band displays with dark background
    Given the pricing section is present
    Then a dark-themed parallax band is visible

  Scenario: Editorial parallax band is present below the grid
    Given the pricing section is present
    Then a second parallax band is visible after the bed grid

  Scenario: Header includes a Pricing navigation entry
    Then a "Pricing" navigation item is present

  Scenario: Add to Cart button has a descriptive aria-label
    Given the pricing section is present
    Then the Add to Cart button has an aria-label that includes the product name
