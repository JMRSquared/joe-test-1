'use strict';
var React = require('react');
function MotionDiv(props) {
  return React.createElement('div', props, props.children);
}
MotionDiv.displayName = 'MotionDiv';
function MotionSpan(props) {
  return React.createElement('span', props, props.children);
}
MotionSpan.displayName = 'MotionSpan';
module.exports = {
  motion: {
    div: MotionDiv,
    span: MotionSpan,
  },
  useScroll: function() { return { scrollYProgress: { current: 0 } }; },
  useTransform: function() { return 0; },
  useInView: function() { return true; },
  AnimatePresence: function AnimatePresence(_a) {
    var children = _a.children;
    return children;
  },
};
