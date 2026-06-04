 
'use strict';

module.exports = {
  transform: {
    '^.+\\.tsx?$': '<rootDir>/jest.transform.cjs',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
