const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const helmet = require('helmet');

const routes = require('./routes');
const ResponseHandler = require('./core/responseHandler');
const env = require('./env.json');

// 連接資料庫
mongoose.connect(env.DB_URL)
  .then(()=> console.log('success connect'))
  .catch((err) => console.log('fail: ', err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// 設定session
const sessionConfig = {
  secret: 'mySecret',
  name: 'login.sid',
  saveUninitialized: false,
  resave: true,
  store: (mongoStore.create({ mongoUrl: env.DB_URL })),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1天
  },
};
app.use(session(sessionConfig));

// 連接路由
app.use('/', routes);

// 當找不到路由時，回傳404
app.use((req, res, next) => {
  ResponseHandler.handle(res, ResponseHandler.statusCode.notFound, { message: '404 not found.' });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});