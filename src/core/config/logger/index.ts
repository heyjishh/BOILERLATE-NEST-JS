import * as winston from "winston";

export const winstonLoggerConfig = {
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss a",
    }),
    winston.format.colorize({ all: true }), // Colorize log output
    winston.format.label({ label: "EMS_JISHH" }), // Add a custom label for the log entries
    winston.format.splat(), // Support for `%`-style string interpolation
    winston.format.simple(), // Simple message output
    winston.format.errors({ stack: true }), // Log error stack traces
    winston.format.json(), // Output logs as JSON (can be useful for structured logs)
    winston.format.prettyPrint(), // Pretty print JSON logs for better readability
    winston.format.printf(({ timestamp, level, message, label, stack }) => {
      // Customize log output format
      const logMessage = stack ? `${message}\n${stack}` : message;
      return `[${timestamp}] ${level} [${label}]: ${logMessage}`;
    }),
  ),
  transports: [
    new winston.transports.Console(), // Console transport with the above format
    // You can add more transports if needed
    // new winston.transports.File({ filename: 'app.log' }), // Log to file
  ],
};
