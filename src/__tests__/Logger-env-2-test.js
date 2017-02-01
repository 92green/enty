import test from 'ava';
require("require.async")(require);

test('Logger: default log level is 0 when undefined', tt => {
    tt.plan(1);
    process.env.NODE_ENV = undefined;
    require.async("../Logger", (logger) => {
        tt.is(logger.default.logLevel, 0);
    });
});
