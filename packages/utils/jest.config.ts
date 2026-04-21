import { type JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/types/**/*.ts',
  ],
  maxWorkers: 2,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  projects: [
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/test/node/**/*.test.ts'],
      testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
      moduleNameMapper: { '^~/(.*)$': '<rootDir>/src/$1' },
    },
    {
      displayName: 'browser',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: ['**/test/browser/**/*.test.ts'],
      testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
      moduleNameMapper: { '^~/(.*)$': '<rootDir>/src/$1' },
    },
  ],
};

export default jestConfig;
