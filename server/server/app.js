/*
* ----------- EventFull -----------
* The event management application!
* =================================
* Created by Ben Lauderbaugh, June 2017
* =================================
* Welcome, this application is the accumulation of the education I received while
* attending Prime Digital Academy in the Psi Cohort.
* =================================
* EventFull is a full stack application using JavaScript, AngularJS, Express,
* Node.js, and PostgreSQL
* =================================
* visit my GitHub to see more of my projects: https://github.com/benjlaud1
*/

// requires
var express = require( 'express' );
var app = express();
var bodyParser = require( 'body-parser' );
var path = require( 'path' );

// authentication includes
var passport = require( './strategies/user_sql.js' );
var session = require( 'express-session' );

// route includes
var events = require( './routes/events' );
var users = require( './routes/users' );
var register = require( './routes/register' );
var index = require( './routes/index' );

// define server port
// var port = process.env.PORT || 3000;
app.set( 'port', ( process.env.PORT || 3000 ) );

// serve static files
app.use( express.static( path.join( __dirname, '../public' ) ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

// Passport Session Configuration //
app.use( session({
   secret: 'secret',
   key: 'user', // this is the name of the req.variable. 'user' is convention, but not required
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 600000, secure: false }
}));

// start up passport sessions
app.use( passport.initialize() );
app.use( passport.session() );

// route incoming requests for events to the events route
app.use( '/events', events );

// route incoming requests for users to the users route
app.use( '/users', users );

// route incoming requests for register to register route
app.use( '/register', register );

// handle all other incoming requests and serve the index.html file
app.use('/*', index );

// open server on on port
app.listen( app.get( 'port' ), function() {
  console.log( 'Event Manager running on port:', app.get( 'port' ) );
}); // end app.listen
