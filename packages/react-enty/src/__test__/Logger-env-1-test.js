require("require.async")(require);

test('Logger: default log level is 1 when development', () => {
    expect.assertions(1);
    process.env.NODE_ENV = 'development';
    require.async("../Logger", (logger) => {
        expect(logger.default.logLevel).toBe(1);
    });
});
