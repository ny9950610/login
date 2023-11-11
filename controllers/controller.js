const logger = require('../utils/log');
const winston = require('winston');


class controller {
    sayHello(req, res, next) {
        logger.info('hello logger');
        res.send('hello Benjarl');
        return next();
    }
}

module.exports = controller;