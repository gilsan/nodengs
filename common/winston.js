const { createLogger, format, transports } = require("winston")
require("winston-daily-rotate-file")
const fs = require("fs")
const appRoot = require('app-root-path');    // app root 경로를 가져오는 lib

const env = process.env.NODE_ENV || "development"
const logDir = `${appRoot}/log`

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)

const dailyRotateFileTransport = new transports.DailyRotateFile({
  level: "debug",
  filename: `${logDir}/%DATE%-smart-push.log`,
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.json(),
    //format.colorize(),
    format.prettyPrint(),   
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  )
})

const logger = createLogger({
  level: env === "development" ? "debug" : "info",
  format: format.combine(
    logFormat
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.json(),
        format.colorize(),
        format.prettyPrint(),   
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
})

module.exports = logger;