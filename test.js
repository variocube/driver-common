#!/usr/bin/env node

const {Logger, LogLevel} = require("./cjs/logger");

Logger.setLogLevel(LogLevel.silly);

const logger = new Logger("test");

logger.error("error");
logger.warn("warn");
logger.info("info");
logger.verbose("verbose");
logger.debug("debug");
logger.silly("silly");

const sub = logger.sub("sub");
sub.info("sub");
