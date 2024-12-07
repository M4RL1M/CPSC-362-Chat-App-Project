module.exports = {
  testEnvironment: 'node', // Adjust to 'jsdom' for browser-like environments
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Use babel-jest for .js, .jsx, .ts, .tsx files
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'], // Support these file types
};

module.exports = {
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    'backend/**/*.js', // Adjust the path to your source code files
    '!**/node_modules/**', // Exclude dependencies
    '!**/coverage/**',     // Exclude coverage directory
    '!backend/**/__tests__/**', // Exclude test files
  ],
  coverageDirectory: 'coverage', // Directory for coverage reports
  coverageReporters: ['text', 'html'], // Show table in terminal and generate HTML report
  testEnvironment: 'node',
};