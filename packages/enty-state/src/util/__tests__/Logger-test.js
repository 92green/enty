// @flow
import Logger from '../Logger';

test('Logger: uses global console by default', () => {
    expect(Logger._console).toBe(console);
});

test('Logger: can use custom console with setConsole', () => {
    var fakeConsole = {
        error: jest.fn()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("...");
    expect(fakeConsole.error).toHaveBeenCalledWith('...');
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
        error: jest.fn(),
        warn: jest.fn(),
        log: jest.fn()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    expect(fakeConsole.error).toHaveBeenCalledWith('error');
    expect(fakeConsole.warn).not.toHaveBeenCalledWith('warn');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('info');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('verbose');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('silly');
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 1 (warn)', () => {
    Logger.setLogLevel("warn");
    var fakeConsole = {
        error: jest.fn(),
        warn: jest.fn(),
        log: jest.fn()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    expect(fakeConsole.error).toHaveBeenCalledWith('error');
    expect(fakeConsole.warn).toHaveBeenCalledWith('warn');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('info');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('verbose');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('silly');
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 2 (info)', () => {
    Logger.setLogLevel("info");
    var fakeConsole = {
        error: jest.fn(),
        warn: jest.fn(),
        log: jest.fn()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    expect(fakeConsole.error).toHaveBeenCalledWith('error');
    expect(fakeConsole.warn).toHaveBeenCalledWith('warn');
    expect(fakeConsole.log).toHaveBeenCalledWith('info');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('verbose');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('silly');
});


test('Logger: setLogLevel will create correct log methods on itself when log level is 3 (verbose)', () => {
    Logger.setLogLevel("verbose");
    var fakeConsole = {
        error: jest.fn(),
        warn: jest.fn(),
        log: jest.fn()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    expect(fakeConsole.error).toHaveBeenCalledWith('error');
    expect(fakeConsole.warn).toHaveBeenCalledWith('warn');
    expect(fakeConsole.log).toHaveBeenCalledWith('info');
    expect(fakeConsole.log).toHaveBeenCalledWith('verbose');
    expect(fakeConsole.log).not.toHaveBeenCalledWith('silly');
});

test('Logger: setLogLevel will create correct log methods on itself when log level is 4 (silly)', () => {
    Logger.setLogLevel("silly");
    var fakeConsole = {
        error: jest.fn(),
        warn: jest.fn(),
        log: jest.fn()
    };
    Logger.setConsole(fakeConsole);
    Logger.error("error");
    Logger.warn("warn");
    Logger.info("info");
    Logger.verbose("verbose");
    Logger.silly("silly");

    expect(fakeConsole.error).toHaveBeenCalledWith('error');
    expect(fakeConsole.warn).toHaveBeenCalledWith('warn');
    expect(fakeConsole.log).toHaveBeenCalledWith('info');
    expect(fakeConsole.log).toHaveBeenCalledWith('verbose');
    expect(fakeConsole.log).toHaveBeenCalledWith('silly');
});



