// requires
var express = require( 'express' );
var router = express.Router();
var passport = require( 'passport' );
var pg = require( 'pg' );

// set up config for the pool
var config = {
  database: 'EventFull',
  host: 'localhost',
  port: 5432,
  max: 10
}; // end config

// setup new pool
var pool = new pg.Pool( config );

// empty array to capture events
var eventsArray = [];

// GET route for all events from database
router.get( '/', function ( req, res ) {
  console.log( 'In events GET' );
  // empty eventsArray
  eventsArray = [];
  if ( true ) {
    // connect to database
    pool.connect( function ( err, connection, done ) {
      // check if there's an error
      if ( err ) {
        console.log( err );
        res.sendStatus( 400 );
      } else {
        console.log( 'Get all from database' );
        // query database
        var resultSet = connection.query( "SELECT * FROM events" );
        resultSet.on( 'row', function ( row ) {
          eventsArray.push( row );
        }); // end resultSet on 'row'
        resultSet.on( 'end', function () {
          done();
          console.log( 'Sending eventsArray with:', eventsArray );
          res.status( 200 ).send( eventsArray );
        }); // end resultSet on end
      } // end else if
    }); // end pool.connect
  } else {
    console.log( 'authentication error' );
    res.sendStatus( 401 );
  } // end isAuthenticated
}); // end base GET

// create new event
router.post( '/', function ( req, res ) {
  console.log( 'In events POST' );
  if ( true ) {
    // create object to save to database
    var databaseModel = {
      name: req.body.name,
      description: req.body.description,
      start_date: req.body.startDate,
      end_date: req.body.endDate,
      creator: req.users.id
    }; // end databaseModel
  } else {
    console.log( 'authentication error' );
    res.redirect( '/' );
  } // end isAuthenticated
}); // end base URL POST

// GET route for single event from database
router.get( '/singleEvent/:id', function ( req, res ) {
  console.log( 'In events/singleEvent' );
  eventsArray = [];
  if ( true ) {
    // connect to database
    pool.connect( function ( err, connection, done ) {
      // check if there's an error
      if ( err ) {
        console.log( err );
        res.sendStatus( 400 );
      } else {
        console.log( 'Get all from database' );
        var resultSet = connection.query( "SELECT * FROM events WHERE id=$1", [ req.params.id ] );
        resultSet.on( 'row', function ( row ) {
          eventsArray.push( row );
        }); // end resultSet on 'row'
        resultSet.on( 'end', function () {
          done();
          console.log( 'Sending eventsArray with:', eventsArray );
          res.status( 200 ).send( eventsArray );
        }); // end resultSet on end
      } // end else if
    }); // end pool.connect
  } else {
    console.log( 'authentication error' );
    res.redirect( '/' );
  } // end isAuthenticated
}); // end /viewEvent GET

module.exports = router;
