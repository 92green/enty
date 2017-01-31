import {Map, List} from 'immutable';

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

var Logger = {

    logLevel: 0,

    setLogLevel: function(level) {
        this.logLevel = this.getLevelIndex(level);

        // create methods on Logger for each logLevel
        logLevels.forEach(({name, consoleMethod}, key) => {

            // by default logging should be noops
            var method = () => {};
            var methodIf = () => {};

            // if the log level allows logging for the current log level, create actual logging methods
            if(this.willLog(key)) {
                method = console[consoleMethod];
                methodIf = (condition, ...args) => condition && console[consoleMethod](...args);
             }

            // set methods on this global Logger instance
            this[name] = method;
            this[`${name}If`] = methodIf;
        });
    },

    willLog: function(level) {
        return this.getLevelIndex(level) <= this.logLevel;
    },

    getLevelIndex: function(level) {
        // level can be a log level string like "error" or "silly", or a number corresponding to a log level
        return typeof level == "string"
            ? logLevels.findIndex(ii => ii.name == level)
            : level;
    }
};

// set initial log level, creating the log methods
Logger.setLogLevel(process.env.NODE_ENV === 'development' ? 1 : 0);
export default Logger;
