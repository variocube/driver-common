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

