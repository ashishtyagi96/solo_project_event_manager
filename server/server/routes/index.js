var express = require( 'express' );
var router = express.Router();
var passport = require( 'passport' );
var path = require( 'path' );

// Handles login from POST
router.post('/',
    passport.authenticate('local'), function ( req, res ){
      console.log( 'in login callback' );
      res.sendStatus( 200 );
    }
);

// serve index file
// Also catches any other request not explicitly matched elsewhere
router.get( '/', function( req, res ) {
  console.log( 'base url hit' );
  res.sendFile( path.resolve( 'server/public/views/index.html' ) );
}); // end base URL GET

module.exports = router;
