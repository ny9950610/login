const express = require('express');
const AccountController = require('../controllers/accountController');

const router = express.Router();

const controller = new AccountController();
router.post('/', (req, res) => controller.execAPI(controller.signup, req, res));
router.put('/', (req, res) => controller.execAPI(controller.update, req, res, { needAuthorize: true, needCheckUser: true }));
router.delete('/', (req, res) => controller.execAPI(controller.delete, req, res, { needAuthorize: true, needCheckUser: true }));
router.post('/session', (req, res) => controller.execAPI(controller.login, req, res));
router.delete('/session', (req, res) => controller.execAPI(controller.logout, req, res, { needAuthorize: true }));
router.post('/reset/verificationCode', (req, res) => controller.execAPI(controller.sendVerificationCode, req, res));
router.put('/reset/', (req, res) => controller.execAPI(controller.reset, req, res));



module.exports = router;