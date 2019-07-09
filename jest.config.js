// @flow
module.exports = {
    preset: 'blueflag-test',
    collectCoverageFrom: [
        "packages/**/*.{js,jsx}",
        "!**/lib/**",
        "!**/node_modules/**",
        "!packages/enty-documentation/**"
    ],
    testMatch: ["**/__test__/**/*-test.js?(x)"]
};
