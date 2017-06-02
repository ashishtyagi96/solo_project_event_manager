var passport = require( 'passport' );
var localStrategy = require( 'passport-local' ).Strategy;
var encrypt = require( '../modules/encryption' );
// var connection = require('../modules/connection'); // does this even need to be here?
var pg = require( 'pg' );

var config = {
  user: 'clmiller6',
  database: 'EventFull',
  password: '',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 1500
}; // end config

// initialize a connection pool, set idle connections to 30 secs and max connections to 10
var pool = new pg.Pool( config );

var acquireCount = 0;
pool.on( 'aquire', function ( client ) {
  acquireCount++;
  console.log( 'client aquired:', acquireCount );
}); // end on aquire

var connectCount = 0;
pool.on( 'connect', function () {
  connectCount++;
  console.log( 'client connected:', connectCount );
}); // end on connect


// serialize and deserialize the user
passport.serializeUser( function ( user, done ) {
  done( null, user.user_email );
}); // end serializeUser

passport.deserializeUser( function ( id, done ) {
  console.log( 'deserializeUser call', id );

  pool.connect( function ( err, client, release ) {
    if ( err ) {
      console.log( 'pool connection error:', err );
      release();
      done( err );
    } // end if err

    var user = {};
    client.query( "SELECT FROM users WHERE id=$1", [ id ], function ( err, result ) {

      if ( err ) {
        console.log( 'query error:', err );
        done( err );
        release();
      } // end if

      user = result.row[0];
      release();

      // check if user was found
      if( !user ) {
        return done( null, false, { message: 'Incorrect credentials' } );
      } else {
        console.log( 'User row:', user );
        done( null, user );
      } // end if else user found
    }); // end query
  }); // end pool.connect
}); // end deserializeUser

// logic for logging in user
passport.use( 'local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
}, function ( req, username, password, done ) {
  console.log( 'local called' );

  pool.connect( function ( err, client, release ) {
    if(err) {
      console.log('ERROR: ', err);
      done(err);
    }

    client.query( "SELECT * FROM users WHERE user_email=$1", [ user_email ], function ( err, result ) {
      var user = {};

      if ( err ) {
        console.log( 'connection error:', err );
        done(err);
      }
      release();
      console.log( 'connection count:', connectCount );
      if ( result.rows[0] != undefined ) {
        user = result.rows[0];
        console.log( 'User found:', user );

        // Hash the inbounc password and compare to password from DB
        if ( encrypt.comparePassword( password, user.password ) ) {
          // passwords match
          console.log( 'passwords match' );
          done( null, user );
        } else {
          console.log( 'passwords did not match' );
          done( null, false, { message: 'Incorrect credentials ' } );
        } // end if else password compare
      } else {
        console.log( 'the user was not found' );
        done( null, false );
      } // end if else check for user
    }); // end client query
  }); // end pool.connect

})); // end passport.use local

module.exports = passport;
