module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
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
  testURL: 'http://localhost',
};
