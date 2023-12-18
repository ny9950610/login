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

// 設定logger輸出
const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), myFormat),
    transports: [
        new winston.transports.Console(), // console輸出
        new winston.transports.DailyRotateFile(dailyRotateTransports) // 文件輸出
    ]
});

module.exports = logger;