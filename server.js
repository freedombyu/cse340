/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const static = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const errorRoute = require('./routes/errorRoute');
const { getNav } = require('./utilities');
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//process Registration Activey
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.use("/account", require("./routes/accountRoute"));
app.get('/', baseController.buildHome);
// Inventory Routes
app.use('/inv', inventoryRoute);
app.use("/account", accountRoute)
// Error Route
app.use('/error', errorRoute);
const invRoute = require("./routes/inventoryRoute");  // or the correct path to your inventory routes
/* *************************************
 * Route Not Found
 * Must be keep after all other routes
 **************************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, it seems that page doesn't exists!" });
});

/* *****************************************
 * Express Error Handler
 * Must be keep after all other middleware
 *******************************************/
app.use(async (err, req, res, next) => {
  const nav = await getNav();
  let message = '';
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status === 404) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

