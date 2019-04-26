module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'script/**.js',
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
