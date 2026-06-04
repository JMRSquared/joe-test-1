/* eslint-disable no-var, vars-on-top */
'use strict';
module.exports = {
  transform: { '^.+\\.tsx?$': require.resolve('./jest.transform.cjs') },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [require.resolve('./jest.setup.js')],
  moduleNameMapper: {
    '^framer-motion$': '<rootDir>/src/__mocks__/framer-motion.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  rootDir: __dirname,
};
