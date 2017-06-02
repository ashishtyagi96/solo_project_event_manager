// requires
var express = require("express");
var router = express.Router();
var passport = require( 'passport' );
var pg = require( 'pg' );

// base route for users, handles requests for user information
router.post( '/', function ( req, res ) {
  // only send user information if logged in
  console.log( 'Checking if logged in' );
  if ( req.isAuthenticated() ) {
    // logged in verified, send user information
    res.status( 200 ).send( req.user );
  } else {
    // not logged in, route back to login screen
    res.redirect( '/' );
  }
}); // end base URL GET

// route to log user out
router.get( '/logout', function ( req, res ) {
  console.log( 'Logging out user' );
  req.logout(); // built in method of passport
  res.sendStatus( 200 );
}); // end logout GET

module.exports = router;
