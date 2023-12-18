const logger = require('../utils/log');

class MainController {
    mainPage(req, res, next) {
        logger.info('hello logger');
        res.render('index');

        return next();
    }

    error404(req, res, next) {
        logger.error('error 404');
        res.render('error404');
    }
}

module.exports = MainController;