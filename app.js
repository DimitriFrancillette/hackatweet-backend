require('dotenv').config();
require('./models/connection');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const tweetsRouter = require('./routes/tweets');
const hashtagsRouter = require('./routes/hashtags');

const app = express();

const corsOptions = {
  origin: 'https://hackhatweet-frontend-pearl.vercel.app',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);
app.use('/hashtags', hashtagsRouter);

// const port = process.env.PORT || 3000;
// console.log(`Server is running on port ${port}`);

module.exports = app;
