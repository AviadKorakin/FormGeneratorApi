var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const formRoutes = require('./routes/forms');
const feedbackRoutes = require('./routes/feedbacks');

var indexRouter = require('./routes/index');
const {urlencoded, json} = require("express");
const session = require('express-session');
const {connectDBAtlas, closeDBAtlasConnection} = require("./dbAtlas");

var app = express();



// Connect to MongoDB Atlas
connectDBAtlas()
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


app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret', // Use an environment variable for security
      resave: false, // Avoid resaving unmodified sessions
      saveUninitialized: false, // Only save sessions with meaningful data
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60, // Session expires after 1 hour
      },
    })
);


// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server and MongoDB connection');
  try {
    await closeDBAtlasConnection();
    console.log('Cleanup complete. Exiting...');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
});


module.exports = app;
