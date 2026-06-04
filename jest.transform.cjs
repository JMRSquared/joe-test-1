'use strict';
global.global = global;
var path = require('path');
var Transformer = require('ts-jest').TsJestTransformer;
var rootDir = __dirname;
var transformer = new Transformer({ '^.+\\.tsx?$': ['ts-jest', { tsconfig: path.join(rootDir, 'tsconfig.app.json'), useESM: true }] });
module.exports = {
  process: function(src, filename) {
    var result = transformer.process(src, filename, { config: { globals: { 'ts-jest': { tsconfig: path.join(rootDir, 'tsconfig.app.json'), useESM: true } }, testEnvironmentOptions: {} }, cacheFS: new Map() });
    var code = result.code || result;
    var compiledCode = code;
    var usesFM = compiledCode.indexOf('require("framer-motion")') !== -1 || compiledCode.indexOf("require('framer-motion')") !== -1;
    if (usesFM) {
      code = code.replace(/const \w+ = require\(['"]framer-motion['"]\);?/g, '/* framer-motion-import-removed */');
      code = code.replace(/\w+\.motion\.(div|span|section|button|img|h[1-6]|[a-z]+)/g, '"$1"');
      code = code.replace(/const isInView = \(0,\s*\w+\.useInView\)\([^)]*\);/g, 'const isInView = true;');
      code = code.replace(/const isInView = \(0,\s*useInView\)\([^)]*\);/g, 'const isInView = true;');
      code = code.replace(/const \{ scrollYProgress \} = \(0,\s*\w+\.useScroll\)\(\{[^}]*\}\);/g, 'const scrollYProgress = { get: function() { return 0; }, current: 0 };');
      code = code.replace(/\(0,\s*\w+\.useTransform\)\([^)]*\)/g, '0');
    }
    code = code.replace(/const isInView = \w+\.useInView\([^)]*\);/g, 'const isInView = true;');
    code = code.replace(/const isInView = useInView\([^)]*\);/g, 'const isInView = true;');
    return { code: code };
  },
};
