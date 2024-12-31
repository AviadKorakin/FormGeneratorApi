const createError = require('http-errors');
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const formRoutes = require('./routes/forms');
const feedbackRoutes = require('./routes/feedbacks');
const userRoutes = require('./routes/users');
const indexRouter = require('./routes/index');
const {urlencoded, json} = require("express");
const session = require('express-session');
const {connectDBAtlas, closeDBAtlasConnection} = require("./dbAtlas");
const {connectDB, closeDBConnection} = require("./db");
const MongoStore = require('connect-mongo');
const passport = require("./passport-util");


const app = express();


const isProduction = process.env.NODE_ENV === 'production';

// Connect to MongoDB based on environment
if (isProduction) {
    console.log('Running in production mode: Using MongoDB Atlas');
    connectDBAtlas()
        .then(() => {
            console.log('Connected to MongoDB Atlas');
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB Atlas:', err);
            process.exit(1);
        });
} else {
    console.log('Running in development mode: Using Docker-based MongoDB');
    connectDB()
        .then(() => {
            console.log('Connected to Docker-based MongoDB');
        })
        .catch((err) => {
            console.error('Failed to connect to Docker-based MongoDB:', err);
            process.exit(1);
        });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret', // Use an environment variable for security
        resave: false, // Avoid resaving unmodified sessions
        saveUninitialized: false, // Only save sessions with meaningful data
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_ATLAS_URI, // Use your MongoDB URI
            ttl: 14 * 24 * 60 * 60, // Session lifetime in seconds (14 days)
            autoRemove: 'native', // Automatically remove expired sessions
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            maxAge: 1000 * 60 * 60, // Session expires after 1 hour
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('Cookies:', req.cookies); // Log cookies sent by the browser
    next();
});

app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    console.log("User from Session:", req.user);
    next();
});

app.use('/', indexRouter);
app.use('/forms', formRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/users', userRoutes);

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
        if (isProduction) {
          await closeDBAtlasConnection();
         } else {
          await closeDBConnection();
        }
        console.log('Cleanup complete. Exiting...');
        process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
});


module.exports = app;
