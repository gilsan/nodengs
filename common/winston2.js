const winston = require('winston')
const { format, transports } = winston
const path = require('path')

const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine(
        format.json()
      )
    })
  ],
  exitOnError: false
})

const req = {
  body: {
    name: 'Daniel Duuch',
    email: 'daniel.duuch@greatmail.com',
    password: 'myGreatPassword'
  }
}

logger.debug(`Register ${req.body.name} with email ${req.body.email}`, req.body)

module.exports = logger;


/*
transports.console.level = 'info';
transports.file.level = 'info';

logger.info('Will not be logged in either transport!');
logger.info('Will be logged in both transports!');

logger.info('What rolls down stairs');
logger.info('alone or in pairs,');
logger.info('and over your neighbors dog?');
logger.warn('Whats great for a snack,');
logger.info('And fits on your back?');
logger.error('Its log, log, log');
*/