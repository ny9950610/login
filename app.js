/**
 * 檔案名稱: app.js
 * 檔案用途: 主程式
 */

const express = require('express');
const router = require('./routers/router');

const app = express();
app.use(express.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// 連接主路由
app.use('/', router);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});