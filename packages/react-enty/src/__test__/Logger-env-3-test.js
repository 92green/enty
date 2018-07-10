require("require.async")(require);

test('Logger: default log level is 0 when production', () => {
    expect.assertions(1);
    process.env.NODE_ENV = 'production';
    require.async("../Logger", (logger) => {
        expect(logger.default.logLevel).toBe(0);
    });
});
