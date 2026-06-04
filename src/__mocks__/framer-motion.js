'use strict';
var React = require('react');
function MDiv(props) { return React.createElement('div', props, props.children); }
function MSpan(props) { return React.createElement('span', props, props.children); }
MDiv.displayName = 'MotionDiv';
MSpan.displayName = 'MotionSpan';
module.exports = {
  motion: { div: MDiv, span: MSpan },
  useScroll: function() { return { scrollYProgress: { current: 0 } }; },
  useTransform: function() { return 0; },
  useInView: function() { return true; },
  AnimatePresence: function(p) { return p.children; },
};
