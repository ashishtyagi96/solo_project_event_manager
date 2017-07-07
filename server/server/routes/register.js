// requires
var express = require( 'express' );
var router = express.Router();
var passport = require('passport');

// modules with bcrypt functions
var encrypt = require('../modules/encryption');
// var connection = require('../modules/connection');

// var pg = require('pg');
var pool = require('../modules/pool');

// handle request to create new user
router.post( '/', function ( req, res, next ) {
  console.log( 'req.body', req.body );
  // create a new user object to store in database
  var newUser = {
    user_email: req.body.user_email,
    user_password: encrypt.encryptPassword( req.body.user_password ),
    first_name: req.body.first_name,
    last_name: req.body.last_name
  }; // end newUser

  // connect to datebase and store newUser
  pool.connect( function ( err, client, done ) {

    // check for error
    if ( err ) {
      console.log( 'connection error in register:', err );
      next( err );
    } else {
      // insert newUser into database
      client.query( "INSERT INTO users ( user_email, user_password, first_name, last_name ) VALUES ( $1, $2, $3, $4 )", [ newUser.user_email, newUser.user_password, newUser.first_name, newUser.last_name ], function ( err, result ) {

        client.end();
        // check for errors
        if ( err ) {
          console.log( 'error creating new user:', err );
          next( err );
        } else {
          // redirect user to login screen
          console.log( 'registered new user' );
          res.redirect( '/' );
        } // end query error handling
      }); // end client.query
    } // end connection error handling
  }); // end pg.connect
}); // end base URL POST

module.exports = router;
