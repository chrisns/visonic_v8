module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ["dotenv/config"],
  // setupFilesAfterEnv: [
  //   "jest-dynalite/setupTables",
  //   // Optional (but recommended)
  //   "jest-dynalite/clearAfterEach"
  // ],
  // preset: "jest-dynalite",
  coverageReporters: ['lcovonly', 'text'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.js',
    '!.**',
    '!tests/**',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.js',
    '!wallaby.js',
  ],
}
