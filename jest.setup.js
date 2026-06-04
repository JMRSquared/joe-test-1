/* eslint-disable no-var, vars-on-top */
'use strict';

require('@testing-library/jest-dom');

// ── Browser API polyfills ───────────────────────────────────────────────────

// window.matchMedia
function createMatchMediaMock(matches) {
  return function matchMedia(query) {
    return {
      matches: matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };
}
window.matchMedia = createMatchMediaMock(false);

// window.requestAnimationFrame / cancelAnimationFrame
window.requestAnimationFrame = function(cb) { return setTimeout(cb, 16); };
window.cancelAnimationFrame = function(id) { clearTimeout(id); };

// IntersectionObserver
class IntersectionObserverMock {
  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.threshold = 0;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
window.IntersectionObserver = IntersectionObserverMock;

// ── Framer Motion mocks ─────────────────────────────────────────────────────

// Mock useInView so components render without needing scroll intersection
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    useInView: jest.fn(() => true),
    useScroll: jest.fn(() => ({
      scrollYProgress: { get: () => 0, current: 0 },
    })),
    useTransform: jest.fn((scrollYProgress, _input, output) =>
      typeof output === 'function' ? output(0) : output,
    ),
    motion: {
      div: require('react').forwardRef(({ children, ...props }, ref) =>
        require('react').createElement('div', { ref, ...props }, children),
      ),
      span: require('react').forwardRef(({ children, ...props }, ref) =>
        require('react').createElement('span', { ref, ...props }, children),
      ),
    },
  };
});