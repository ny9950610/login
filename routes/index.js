const express = require('express');
const AccountRoute = require('./accountRoute');

const router = express.Router();

router.use('/account', AccountRoute);

module.exports = router;