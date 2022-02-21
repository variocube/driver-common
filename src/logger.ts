import chalk from "chalk";

export enum LogLevel {
    error,
    warn,
    info,
    verbose,
    debug,
    silly
}

export class Logger {

    constructor(readonly name?: string) {
    }

    private static logLevel = LogLevel.info;

    static setLogLevel(logLevel: LogLevel) {
        Logger.logLevel = logLevel;
    }

    silly(...args: any[]) {
        if (this.isSillyEnabled()) {
            console.debug(this.getPrefix(chalk.blackBright("SILLY  ")), ...args);
        }
    }

    debug(...args: any[]) {
        if (this.isDebugEnabled()) {
            console.debug(this.getPrefix("DEBUG  "), ...args);
        }
    }

    verbose(...args: any[]) {
        if (this.isVerboseEnabled()) {
            console.debug(this.getPrefix(chalk.blue("VERBOSE")), ...args);
        }
    }

    info(...args: any[]) {
        if (this.isInfoEnabled()) {
            console.info(this.getPrefix(chalk.blueBright("INFO   ")), ...args);
        }
    }
    warn(...args: any[]) {
        if (this.isWarnEnabled()) {
            console.warn(this.getPrefix(chalk.yellowBright("WARN   ")), ...args);
        }
    }
    error(...args: any[]) {
        if (this.isErrorEnabled()) {
            console.error(this.getPrefix(chalk.red("ERROR  ")), ...args);
        }
    }

    isSillyEnabled() {
        return Logger.logLevel >= LogLevel.silly;
    }

    isDebugEnabled() {
        return Logger.logLevel >= LogLevel.debug;
    }

    isVerboseEnabled() {
        return Logger.logLevel >= LogLevel.verbose;
    }

    isInfoEnabled() {
        return Logger.logLevel >= LogLevel.info;
    }

    isWarnEnabled() {
        return Logger.logLevel >= LogLevel.warn;
    }

    isErrorEnabled() {
        return Logger.logLevel >= LogLevel.error;
    }

    sub(name: string) {
        return new Logger(this.name ? [this.name, name].join(" > ") : name);
    }

    private getPrefix(logLevelStr: string) {
        return `${logLevelStr} ${this.name || ""}: `
    }
}

/**
 * Returns an appropriate log level for a given count of verbosity increments
 * as typically specified on the command line as `-v`, `-vv` or `-vvv`
 * @param verbosityIncrements The number of verbosity increments
 */
export function getLogLevel(verbosityIncrements: number) {
    switch (verbosityIncrements) {
        case 0:
            return LogLevel.info;
        case 1:
            return LogLevel.verbose;
        case 2:
            return LogLevel.debug;
        default:
            return LogLevel.silly;
    }
}

/**
 * Parses a log level string into the corresponding enum value
 * @param logLevel The log level name
 */
export function parseLogLevel(logLevel?: string) {
    if (!logLevel) {
        return undefined;
    }
    if (!Object.keys(LogLevel).includes(logLevel)) {
        throw new Error("Invalid log level: " + logLevel);
    }
    return LogLevel[logLevel as keyof typeof LogLevel];
}
