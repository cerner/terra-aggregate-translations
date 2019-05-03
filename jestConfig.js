module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**.js',
  ],
  coverageDirectory: 'tests/jest/reports/coverage',
  coverageReporters: [
    'html',
    'lcov',
    'cobertura',
    'text-summary',
  ],
  testMatch: [
    '**/*.test.js',
  ],
  roots: [process.cwd()],
  testURL: 'http://localhost',
};
