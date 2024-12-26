import { type JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};

export default jestConfig;
