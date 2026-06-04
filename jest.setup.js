'use strict';

require('@testing-library/jest-dom');

window.matchMedia = function(query) {
  return { matches: false, media: query, onchange: null, addListener: function() {}, removeListener: function() {}, addEventListener: function() {}, removeEventListener: function() {}, dispatchEvent: function() { return true; } };
};
window.requestAnimationFrame = function(cb) { return setTimeout(cb, 16); };
window.cancelAnimationFrame = function(id) { clearTimeout(id); };
window.IntersectionObserver = function() { this.root = null; this.rootMargin = ''; this.threshold = 0; };
window.IntersectionObserver.prototype.observe = function() {};
window.IntersectionObserver.prototype.unobserve = function() {};
window.IntersectionObserver.prototype.disconnect = function() {};
window.IntersectionObserver.prototype.takeRecords = function() { return []; };

var React = require('react');

function mc(tag) {
  return React.forwardRef ? React.forwardRef(function M(props, ref) { return React.createElement(tag, Object.assign({}, props, { ref: ref })); }) : function M(props) { return React.createElement(tag, props, props.children); };
}

jest.mock('framer-motion', function() {
  return {
    motion: { div: mc('div'), span: mc('span'), section: mc('section'), button: mc('button'), img: mc('img'), h1: mc('h1'), h2: mc('h2'), h3: mc('h3') },
    useInView: function() { return true; },
    useScroll: function() { return { scrollYProgress: { get: function() { return 0; }, current: 0 } }; },
    useTransform: function() { return 0; },
    AnimatePresence: function(p) { return p.children; },
    useMotionTemplate: function() { return ''; },
    useSpring: function() { return 0; },
    MotionConfig: function(p) { return p.children; },
  };
});
