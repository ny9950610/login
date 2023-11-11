const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const {combine, timestamp, printf} = winston.format;
const dailyRotateTransports = {
    filename: './logs/%DATE%/log.txt',
    datePattern: 'YYYYMMDD',
    maxFiles: '30d',
};
const myFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), myFormat),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile(dailyRotateTransports)
    ]
});

module.exports = logger;