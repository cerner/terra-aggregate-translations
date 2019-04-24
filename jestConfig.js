module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  setupFiles: [
    './jestSetup.js',
  ],
  coverageDirectory: 'tests/jest/reports/coverage',
  coverageReporters: [
    'html',
    'lcov',
    'cobertura',
    'text-summary',
  ],
  testMatch: [
    '**/(*.)(spec|test).js?(x)',
  ],
  roots: [process.cwd()],
  snapshotSerializers: [
    './node_modules/enzyme-to-json/serializer',
  ],
  testURL: 'http://localhost',
};
