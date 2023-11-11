const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();
const temp = new controller();
router.get('/', temp.sayHello);

module.exports = router;