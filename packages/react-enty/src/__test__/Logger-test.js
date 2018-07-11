import sinon from 'sinon';
import Logger from '../Logger';

test('Logger: uses global console by default', () => {
    expect(Logger._console).toBe(console);
});

test('Logger: can use custom console with setConsole', () => {
    var fakeConsole = {
        error: sinon.spy()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("...");
    expect(fakeConsole.error.calledOnce).toBe(true);
});

test('Logger: getLevelIndex returns a number when given a number', () => {
    expect(Logger.getLevelIndex(0)).toBe(0);
    expect(Logger.getLevelIndex(1)).toBe(1);
    expect(Logger.getLevelIndex(-1)).toBe(-1);
});

test('Logger: getLevelIndex returns the index of a log level when given a string name of a log level', () => {
    expect(Logger.getLevelIndex("error")).toBe(0);
    expect(Logger.getLevelIndex("warn")).toBe(1);
    expect(Logger.getLevelIndex("info")).toBe(2);
    expect(Logger.getLevelIndex("verbose")).toBe(3);
    expect(Logger.getLevelIndex("silly")).toBe(4);
});

test('Logger: setLogLevel sets the log level number correctly', () => {
    for(var i = 0; i < 5; i++) {
        Logger.setLogLevel(i);
        expect(Logger.logLevel).toBe(i);
    }
});

test('Logger: willLog will log correct stuff when log level is 0 (error)', () => {
    Logger.setLogLevel("error");
    expect(Logger.willLog("error")).toBe(true);
    expect(Logger.willLog("warn")).toBe(false);
    expect(Logger.willLog("info")).toBe(false);
    expect(Logger.willLog("verbose")).toBe(false);
    expect(Logger.willLog("silly")).toBe(false);
});

test('Logger: willLog will log correct stuff when log level is 1 (warn)', () => {
    Logger.setLogLevel("warn");
    expect(Logger.willLog("error")).toBe(true);
    expect(Logger.willLog("warn")).toBe(true);
    expect(Logger.willLog("info")).toBe(false);
    expect(Logger.willLog("verbose")).toBe(false);
    expect(Logger.willLog("silly")).toBe(false);
});

test('Logger: willLog will log correct stuff when log level is 2 (info)', () => {
    Logger.setLogLevel("info");
    expect(Logger.willLog("error")).toBe(true);
    expect(Logger.willLog("warn")).toBe(true);
    expect(Logger.willLog("info")).toBe(true);
    expect(Logger.willLog("verbose")).toBe(false);
    expect(Logger.willLog("silly")).toBe(false);
});


test('Logger: willLog will log correct stuff when log level is 3 (verbose)', () => {
    Logger.setLogLevel("verbose");
    expect(Logger.willLog("error")).toBe(true);
    expect(Logger.willLog("warn")).toBe(true);
    expect(Logger.willLog("info")).toBe(true);
    expect(Logger.willLog("verbose")).toBe(true);
    expect(Logger.willLog("silly")).toBe(false);
});


test('Logger: willLog will log correct stuff when log level is 4 (silly)', () => {
    Logger.setLogLevel("silly");
    expect(Logger.willLog("error")).toBe(true);
    expect(Logger.willLog("warn")).toBe(true);
    expect(Logger.willLog("info")).toBe(true);
    expect(Logger.willLog("verbose")).toBe(true);
    expect(Logger.willLog("silly")).toBe(true);
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 0 (error)', () => {
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

    expect(
        fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error"
    ).toBe(true);
    expect(fakeConsole.warn.called).toBe(false);
    expect(fakeConsole.log.called).toBe(false);
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 1 (warn)', () => {
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

    expect(
        fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error"
    ).toBe(true);
    expect(
        fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn"
    ).toBe(true);
    expect(fakeConsole.log.called).toBe(false);
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 2 (info)', () => {
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

    expect(
        fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error"
    ).toBe(true);
    expect(
        fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn"
    ).toBe(true);
    expect(fakeConsole.log.calledOnce && fakeConsole.log.firstCall.args[0] == "info").toBe(true);
});


test('Logger: setLogLevel will create correct log methods on itself when log level is 3 (verbose)', () => {
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

    expect(
        fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error"
    ).toBe(true);
    expect(
        fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn"
    ).toBe(true);
    expect(fakeConsole.log.calledTwice && fakeConsole.log.firstCall.args[0] == "info").toBe(true);
    expect(
        fakeConsole.log.calledTwice && fakeConsole.log.secondCall.args[0] == "verbose"
    ).toBe(true);
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 4 (silly)', () => {
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

    expect(
        fakeConsole.error.calledOnce && fakeConsole.error.firstCall.args[0] == "error"
    ).toBe(true);
    expect(
        fakeConsole.warn.calledOnce && fakeConsole.warn.firstCall.args[0] == "warn"
    ).toBe(true);
    expect(
        fakeConsole.log.calledThrice && fakeConsole.log.firstCall.args[0] == "info"
    ).toBe(true);
    expect(
        fakeConsole.log.calledThrice && fakeConsole.log.secondCall.args[0] == "verbose"
    ).toBe(true);
    expect(
        fakeConsole.log.calledThrice && fakeConsole.log.thirdCall.args[0] == "silly"
    ).toBe(true);
});



