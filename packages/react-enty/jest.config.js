module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    testMatch: ['<rootDir>/src/**/__tests__/*-test.(ts|tsx)'],
    collectCoverageFrom: ['<rootDir>/src/**/*.(ts|tsx)'],
    testEnvironment: 'enzyme',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80
        }
    }
};
