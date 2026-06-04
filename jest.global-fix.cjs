/* eslint-disable no-var, vars-on-top */
'use strict';

// This file is --require'd by Node BEFORE Jest starts.
// At this point `global` IS defined (Node 22 NodeGlobal).
// We expose `global.global = global` so any package that does `global.X`
// can still find what it needs even if the `global` reference is lost
// in a later ESM transform layer.
global.global = global;

module.exports = {};