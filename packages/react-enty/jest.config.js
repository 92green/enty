module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    testMatch: ['<rootDir>/src/**/__tests__/*.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
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
