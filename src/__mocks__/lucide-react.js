'use strict';
var React = require('react');
function IMock(props) { return React.createElement('i', { 'data-lucide-icon': props['data-testid'] || 'lucide-icon' }, props.children); }
module.exports = {
  ArrowRight: IMock, ArrowUpRight: IMock, Check: IMock, CheckCircle2: IMock,
  Gauge: IMock, Image: IMock, Images: IMock, Layers3: IMock,
  LayoutTemplate: IMock, Menu: IMock, MonitorPlay: IMock,
  MousePointer2: IMock, Paintbrush2: IMock, Scaling: IMock,
  Smartphone: IMock, Sparkles: IMock, X: IMock, Zap: IMock,
};
module.exports.default = module.exports;
