const logger = require('../utils/log');
const db = require('../utils/datbase');

class accountController {
    register(req, res, next) {
        // 取得要申請的帳號密碼
        const account = req.body.account;
        const password = req.body.password;
        logger.info(`call API register: ${account} ${password}`);

        // 
        //const database = db.run();
        //database.db('login').command({ping: 1});

        return next();
    }
}

module.exports = accountController;