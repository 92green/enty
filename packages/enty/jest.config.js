module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/__tests__/*.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts']
};
