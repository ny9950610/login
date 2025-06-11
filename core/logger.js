const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const { combine, timestamp, printf } = winston.format;

const messageFormat = printf(({ timestamp, level, message }) => {
	return `${timestamp} [${level}]: ${message}`;
});

function createLogger(account, level) {
	const dailyRotateTransports = {
		filename: `./logs/${account}/log_%DATE%.txt`,
		datePattern: 'YYYY-MM-DD',
		maxFiles: '30d',
	};

	return winston.createLogger({
		level,
		format: combine(timestamp(), messageFormat),
		transports: [
			new winston.transports.Console(),
			new winston.transports.DailyRotateFile(dailyRotateTransports),
		]
	})
}

class Logger {
	static level = {
		error: 'error',
		info: 'info',
	};

	static write(level, message, account = '__system') {
		const logger = createLogger(account, level);
		logger.info(message);
}
}

module.exports = Logger;