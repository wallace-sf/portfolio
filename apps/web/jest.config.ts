import { type JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: {
          moduleResolution: 'node',
          module: 'commonjs',
        },
      },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  resolver: './jest-resolver.cjs',
  moduleNameMapper: {
    // Exact aliases for apps/web (no slash — do NOT conflict with packages' ~/*)
    '^~components$': '<rootDir>/src/components/index.ts',
    '^~contexts$': '<rootDir>/src/contexts/index.ts',
    '^~hocs$': '<rootDir>/src/hocs/index.ts',
    '^~hooks$': '<rootDir>/src/hooks/index.ts',
    '^~utils$': '<rootDir>/src/utils/index.ts',
    '^~types$': '<rootDir>/src/types.ts',
    // ~/... is handled by jest-resolver.cjs (context-aware per package)
  },
};

export default jestConfig;
