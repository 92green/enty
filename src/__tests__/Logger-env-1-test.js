import test from 'ava';
require("require.async")(require);

test('Logger: default log level is 1 when development', tt => {
    tt.plan(1);
    process.env.NODE_ENV = 'development';
    require.async("../Logger", (logger) => {
        tt.is(logger.default.logLevel, 1);
    });
});
