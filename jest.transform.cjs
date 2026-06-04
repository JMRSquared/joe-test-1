/* eslint-disable no-var, vars-on-top */
'use strict';

// MUST be the first thing — graceful-fs (loaded by @jest/expect) needs `global`
global.global = global;

var path = require('path');
var tsj = require('ts-jest');
var Transformer = tsj.TsJestTransformer;

var rootDir = __dirname;

var TS_JEST_OPTIONS = {
  tsconfig: path.join(rootDir, 'tsconfig.app.json'),
  useESM: true,
};

var transformer = new Transformer({
  '^.+\\.tsx?$': ['ts-jest', TS_JEST_OPTIONS],
});

module.exports = {
  process: function(src, filename) {
    var result = transformer.process(src, filename, {
      config: {
        globals: { 'ts-jest': TS_JEST_OPTIONS },
        testEnvironmentOptions: {},
      },
      cacheFS: new Map(),
    });

    var code = result.code || result;

    // Only process files that import framer-motion
    var usesFM = code.indexOf('require("framer-motion")') !== -1 || code.indexOf("require('framer-motion')") !== -1;

    if (usesFM) {
      // Remove the framer-motion require line
      code = code.replace(/const \w+ = require\(['"]framer-motion['"]\);?/g, '/* framer-motion-mock */');

      // motion.div → "div" (plain HTML element name for jsx-runtime)
      code = code.replace(/\w+\.motion\.(\w+)/g, '"$1"');

      // useScroll — replace the entire statement including the call args
      // Matches: const { scrollYProgress } = (0, framer_motion_1.useScroll)({target: ref, offset: [...]});
      code = code.replace(
        /const \{ scrollYProgress \} = \(0,\s*\w+\.useScroll\)\(\{[^}]*target:\s*ref[^}]*\}\);/g,
        'const scrollYProgress = { get: function() { return 0; }, current: 0 };'
      );

      // useTransform — replace with 0
      code = code.replace(/\(0,\s*\w+\.useTransform\)\([^)]*\)/g, '0');
    }

    // Replace the entire const isInView = useInView(...) assignment with a constant
    code = code.replace(/const isInView = \w+\.useInView\([^)]*\);/g, 'const isInView = true;');
    code = code.replace(/const isInView = useInView\([^)]*\);/g, 'const isInView = true;');

    return { code: code };
  },
};