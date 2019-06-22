const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const { prepareRedirectURL, prep } = require('./middleware/prep');
const { prepareMtUser } = require('./middleware/user-auth');
const configureCors = require('./middleware/cors');

const initializeDb = require('./dbs/mt');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const oauthRouter = require('./routes/oauth');
const logoutRouter = require('./routes/logout');
const forgotRouter = require('./routes/forgot');
const resetRouter = require('./routes/reset');

const app = express();

initializeDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(configureCors);
app.use(prep);
app.use(prepareMtUser);
app.use(prepareRedirectURL);

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/oauth', oauthRouter);
app.use('/logout', logoutRouter);
app.use('/forgot', forgotRouter);
app.use('/reset', resetRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;