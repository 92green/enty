// @flow
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        "packages/**/*.{js,jsx}",
        "!**/lib/**",
        "!**/node_modules/**",
        "!packages/enty-docs/**"
    ],
    testMatch: ["**/__test__/**/*.js?(x)"],
    coverageReporters: ["json", "lcov", "text-summary"]
};
