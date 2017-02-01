import test from 'ava';
import sinon from 'sinon';
import Logger from '../Logger';

test('Logger: uses global console by default', tt => {
    tt.is(Logger._console, console);
});

test('Logger: can use custom console with setConsole', tt => {
    var fakeConsole = {
        error: sinon.spy()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("...");
    tt.true(fakeConsole.error.calledOnce);
});

test('Logger: getLevelIndex returns a number when given a number', tt => {
    tt.is(Logger.getLevelIndex(0), 0);
    tt.is(Logger.getLevelIndex(1), 1);
    tt.is(Logger.getLevelIndex(-1), -1);
});

test('Logger: getLevelIndex returns the index of a log level when given a string name of a log level', tt => {
    tt.is(Logger.getLevelIndex("error"), 0);
    tt.is(Logger.getLevelIndex("warn"), 1);
    tt.is(Logger.getLevelIndex("info"), 2);
    tt.is(Logger.getLevelIndex("verbose"), 3);
    tt.is(Logger.getLevelIndex("silly"), 4);
});

test('Logger: setLogLevel sets the log level number correctly', tt => {
    for(var i = 0; i < 5; i++) {
        Logger.setLogLevel(i);
        tt.is(Logger.logLevel, i);
    }
});

test('Logger: willLog will log correct stuff when log level is 0 (error)', tt => {
    Logger.setLogLevel("error");
    tt.true(Logger.willLog("error"), 'will log error');
    tt.false(Logger.willLog("warn"), 'will not log warn');
    tt.false(Logger.willLog("info"), 'will not log info');
    tt.false(Logger.willLog("verbose"), 'will not log verbose');
    tt.false(Logger.willLog("silly"), 'will not log silly');
});

test('Logger: willLog will log correct stuff when log level is 1 (warn)', tt => {
    Logger.setLogLevel("warn");
    tt.true(Logger.willLog("error"), 'will log error');
    tt.true(Logger.willLog("warn"), 'will log warn');
    tt.false(Logger.willLog("info"), 'will not log warn');
    tt.false(Logger.willLog("verbose"), 'will not log silly');
    tt.false(Logger.willLog("silly"), 'will not log silly');
});

test('Logger: willLog will log correct stuff when log level is 2 (info)', tt => {
    Logger.setLogLevel("info");
    tt.true(Logger.willLog("error"), 'will log error');
    tt.true(Logger.willLog("warn"), 'will log warn');
    tt.true(Logger.willLog("info"), 'will log warn');
    tt.false(Logger.willLog("verbose"), 'will not log silly');
    tt.false(Logger.willLog("silly"), 'will not log silly');
});


test('Logger: willLog will log correct stuff when log level is 3 (verbose)', tt => {
    Logger.setLogLevel("verbose");
    tt.true(Logger.willLog("error"), 'will log error');
    tt.true(Logger.willLog("warn"), 'will log warn');
    tt.true(Logger.willLog("info"), 'will log warn');
    tt.true(Logger.willLog("verbose"), 'will log silly');
    tt.false(Logger.willLog("silly"), 'will not log silly');
});


test('Logger: willLog will log correct stuff when log level is 4 (silly)', tt => {
    Logger.setLogLevel("silly");
    tt.true(Logger.willLog("error"), 'will log error');
    tt.true(Logger.willLog("warn"), 'will log warn');
    tt.true(Logger.willLog("info"), 'will log warn');
    tt.true(Logger.willLog("verbose"), 'will log silly');
    tt.true(Logger.willLog("silly"), 'will log silly');
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 0 (error)', tt => {
    Logger.setLogLevel("error");
    var fakeConsole = {
        error: sinon.spy(),
        warn: sinon.spy(),
        log: sinon.spy()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    tt.true(fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error");
    tt.false(fakeConsole.warn.called);
    tt.false(fakeConsole.log.called);
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 1 (warn)', tt => {
    Logger.setLogLevel("warn");
    var fakeConsole = {
        error: sinon.spy(),
        warn: sinon.spy(),
        log: sinon.spy()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    tt.true(fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error");
    tt.true(fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn");
    tt.false(fakeConsole.log.called);
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 2 (info)', tt => {
    Logger.setLogLevel("info");
    var fakeConsole = {
        error: sinon.spy(),
        warn: sinon.spy(),
        log: sinon.spy()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    tt.true(fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error");
    tt.true(fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn");
    tt.true(fakeConsole.log.calledOnce && fakeConsole.log.firstCall.args[0] == "info");
});


test('Logger: setLogLevel will create correct log methods on itself when log level is 3 (verbose)', tt => {
    Logger.setLogLevel("verbose");
    var fakeConsole = {
        error: sinon.spy(),
        warn: sinon.spy(),
        log: sinon.spy()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    tt.true(fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error");
    tt.true(fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn");
    tt.true(fakeConsole.log.calledTwice && fakeConsole.log.firstCall.args[0] == "info");
    tt.true(fakeConsole.log.calledTwice && fakeConsole.log.secondCall.args[0] == "verbose");
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 4 (silly)', tt => {
    Logger.setLogLevel("silly");
    var fakeConsole = {
        error: sinon.spy(),
        warn: sinon.spy(),
        log: sinon.spy()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    tt.true(fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error");
    tt.true(fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn");
    tt.true(fakeConsole.log.calledThrice && fakeConsole.log.firstCall.args[0] == "info");
    tt.true(fakeConsole.log.calledThrice && fakeConsole.log.secondCall.args[0] == "verbose");
    tt.true(fakeConsole.log.calledThrice && fakeConsole.log.thirdCall.args[0] == "silly");
});



