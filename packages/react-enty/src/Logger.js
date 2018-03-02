// @flow
import {List} from 'immutable';

type Logger = {
    logLevel: number,
    _console: Object,
    [key: string]: Function
};

const logLevels = List([
    {
        name: 'error',
        consoleMethod: 'error'
    },
    {
        name: 'warn',
        consoleMethod: 'warn'
    },
    {
        name: 'info',
        consoleMethod: 'log'
    },
    {
        name: 'verbose',
        consoleMethod: 'log'
    },
    {
        name: 'silly',
        consoleMethod: 'log'
    }
]);

var logger: Logger = {

    logLevel: 0,
    _console: console,

    setLogLevel: function(level: number) {
        this.logLevel = this.getLevelIndex(level);

        // create methods on Logger for each logLevel
        logLevels.forEach(({name, consoleMethod}: Object, key: number) => {

            // by default logging should be noops
            var method = () => {};
            var methodIf = () => {};

            // if the log level allows logging for the current log level, create actual logging methods
            if(this.willLog(key)) {
                method = this._console[consoleMethod];
                methodIf = (condition, ...args) => condition && this._console[consoleMethod](...args);
            }

            // set methods on this global Logger instance
            this[name] = method;
            this[`${name}If`] = methodIf;
        });
    },

    setConsole: function(newConsole: Object) {
        this._console = newConsole;
        // rebuild logging functions
        this.setLogLevel(this.logLevel);
    },

    willLog: function(level: number|string): boolean {
        return this.getLevelIndex(level) <= this.logLevel;
    },

    getLevelIndex: function(level: number|string): number {
        // level can be a log level string like "error" or "silly", or a number corresponding to a log level
        return typeof level == "string"
            ? logLevels.findIndex(ii => ii.name == level.toString())
            : level;
    }
};

// set initial log level, creating the log methods
logger.setLogLevel(process.env.NODE_ENV === 'development' ? 1 : 0);
export default logger;
