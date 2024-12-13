var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const formRoutes = require('./routes/forms');
const feedbackRoutes = require('./routes/feedbacks');

var indexRouter = require('./routes/index');
const {connectDB,closeDBConnection } = require("./db");
const {urlencoded, json} = require("express");

var app = express();

// Connect to MongoDB and prepare the database
connectDB()
    .then(() => {
      console.log('Database setup complete');
    })
    .catch((err) => {
      console.error('Failed to setup database:', err);
      process.exit(1);
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/forms', formRoutes);
app.use('/feedbacks', feedbackRoutes);

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});



// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server and MongoDB connection');
  try {
    await closeDBConnection();
    console.log('Cleanup complete. Exiting...');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
});


module.exports = app;
