/* eslint-disable no-var, vars-on-top */
'use strict';

var React = require('react');

function mockMotion(Tag) {
  return React.forwardRef(function MockedMotion(_props, ref) {
    var props = _props || {};
    var children = props.children;
    delete props.children;
    return React.createElement(Tag, Object.assign({}, props, { ref: ref }), children);
  });
}

module.exports = {
  __esModule: true,
  motion: {
    div: mockMotion('div'),
    span: mockMotion('span'),
    section: mockMotion('section'),
  },
  useInView: function useInViewMock() {
    return true;
  },
  useScroll: function useScrollMock() {
    return {
      scrollYProgress: {
        get: function() { return 0; },
        current: 0,
      },
    };
  },
  useTransform: function useTransformMock(_progress, _input, output) {
    if (typeof output === 'function') {
      return output(0);
    }
    return output;
  },
  AnimatePresence: function AnimatePresenceMock(props) {
    return props.children;
  },
};