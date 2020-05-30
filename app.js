/* app.js */

// import depedencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

// create server app
const app = express();

// db setup
const { Pool } = require('pg');
const pool = new Pool({
  // user: 'ezdcjmwkqijcfe',
  // host: 'ec2-54-147-209-121.compute-1.amazonaws.com',
  // database: 'd5d61lskdpugm',
  // password: '1a7eff832d87660bd443ed4c4dc9d35e982ec085a19c4076ebd4ce4d9198392d',
  // port: 5432

  user: 'postgres',
  host: 'localhost',
  database: 'ukmi',
  password: 'docker',
  port: 5432
})
console.log("successfull connect to the database")

// declare user
const indexRouter = require('./routes/index.js')(pool);
const adminRouter = require('./routes/admin')(pool);
const usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'aplikasiaingkumahaaing',
  resave: true,
  saveUninitialized: true
}))
app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// call router
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
