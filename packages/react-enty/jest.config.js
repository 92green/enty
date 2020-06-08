module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    testMatch: ['<rootDir>/src/**/__tests__/*-test.{ts,tsx}'],
    collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
    setupFilesAfterEnv: ['./setupTests.ts'],
    testEnvironment: 'enzyme',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100
        }
    }
};
