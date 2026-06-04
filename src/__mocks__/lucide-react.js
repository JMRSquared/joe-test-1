'use strict';
var React = require('react');

function IconMock(props) {
  return React.createElement('i', { 'data-lucide-icon': props['data-testid'] || 'lucide-icon', ...props });
}
IconMock.displayName = 'IconMock';

var lucideIcons = {
  ArrowRight: IconMock,
  ArrowUpRight: IconMock,
  Check: IconMock,
  CheckCircle2: IconMock,
  Gauge: IconMock,
  Image: IconMock,
  Images: IconMock,
  Layers3: IconMock,
  LayoutTemplate: IconMock,
  LucideIcon: function LucideIconType() { return null; },
  Menu: IconMock,
  MonitorPlay: IconMock,
  MousePointer2: IconMock,
  Paintbrush2: IconMock,
  Scaling: IconMock,
  Smartphone: IconMock,
  Sparkles: IconMock,
  X: IconMock,
  Zap: IconMock,
};

module.exports = lucideIcons;
module.exports.default = lucideIcons;
