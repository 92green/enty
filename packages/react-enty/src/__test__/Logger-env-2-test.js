require("require.async")(require);

test('Logger: default log level is 0 when undefined', () => {
    expect.assertions(1);
    process.env.NODE_ENV = undefined;
    require.async("../Logger", (logger) => {
        expect(logger.default.logLevel).toBe(0);
    });
});
