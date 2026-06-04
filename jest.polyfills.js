 

// CJS polyfills loaded before the jest environment.
// Node 22's NodeGlobal uses `global` but ts-jest/esbuild loses it in ESM mode.
// Running via CJS config (jest.config.cjs) keeps `global` in scope.

var util = require('util');
globalThis.TextEncoder = util.TextEncoder;
globalThis.TextDecoder = util.TextDecoder;

// graceful-fs accesses `global` directly. In Node 22, `global` exists as
// the NodeGlobal but does NOT expose a `global` property on itself.
// Fix: create `global.global = global` so any `global.X` lookup succeeds.
if (!globalThis.global) {
  Object.defineProperty(globalThis, 'global', {
    value: globalThis,
    writable: true,
    configurable: true,
  });
}