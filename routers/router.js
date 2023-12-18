/**
 * 檔案名稱: router.js
 * 檔案用途: 主路由
 */

const express = require('express');
const accountRouter = require('../routers/accountRouter');
const mainRouter = require('../routers/mainRouter');

const router = express.Router();
router.use('/', mainRouter);
router.use('/account', accountRouter);

module.exports = router;