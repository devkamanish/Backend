const EventEmitter = require("events");

class Logger extends EventEmitter {}

const logger = new Logger();

logger.on("log", (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
});

module.exports = logger;
