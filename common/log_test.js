
const logger = require('./winston2');

logger.info('Will not be logged in either transport!');
logger.info('Will be logged in both transports!');

logger.info('What rolls down stairs');
logger.info('alone or in pairs,');
logger.info('and over your neighbors dog?');
logger.warn('Whats great for a snack,');
logger.info('And fits on your back?');
logger.error('Its log, log, log');