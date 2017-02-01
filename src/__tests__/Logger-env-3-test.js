import test from 'ava';
require("require.async")(require);

test('Logger: default log level is 0 when production', tt => {
    tt.plan(1);
    process.env.NODE_ENV = 'production';
    require.async("../Logger", (logger) => {
        tt.is(logger.default.logLevel, 0);
    });
});
