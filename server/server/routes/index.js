var express = require( 'express' );
var router = express.Router();
var passport = require( 'passport' );
var path = require( 'path' );

// Handles login from POST
router.post( '/', function ( req, res ) {
  console.log('req.body ->', req.body);
  passport.authenticate('local', {
      successRedirect: '/users',
      failureRedirect: '/'
  });
  res.send('woof');
}

  );
  //function(req, res) {
    // console.log('index module: ', req.body);
    // res.send('hi');

//     /*, // end passport.authenticate
//     function ( req, res ) {
//       console.log( 'in base POST with:', req.body );
//     }*/
// ); // end base URL POST

// serve index file
// Also catches any other request not explicitly matched elsewhere
router.get( '/', function( req, res ) {
  console.log( 'base url hit' );
  res.sendFile( path.resolve( 'server/public/views/index.html' ) );
}); // end base URL GET

module.exports = router;