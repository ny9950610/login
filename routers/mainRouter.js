const express = require('express');
const MainController = require('../controllers/mainController');

const router = express.Router();
const controller = new MainController();

router.get('/', controller.mainPage);
router.get('/404', controller.error404);

module.exports = router;