const express = require('express');
const AccountController = require('../controllers/accountController');

const router = express.Router();
const controller = new AccountController();

router.post('/register', controller.register);

module.exports = router;