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
// empty array to capture days
var daysArray = [];

// GET route for all events from database
router.get( '/', function ( req, res ) {
  console.log( 'In events GET' );
  // empty eventsArray
  eventsArray = [];
  if ( true ) { // req.isAuthenticated()
    // connect to database
    pool.connect( function ( err, connection, done ) {
      // check if there's an error
      if ( err ) {
        console.log( err );
        res.sendStatus( 400 );
      } else {
        console.log( 'Get all from database' );
        // query database
        var resultSet = connection.query( "SELECT * FROM events ORDER BY start_date" );
        resultSet.on( 'row', function ( row ) {
          eventsArray.push( row );
        }); // end resultSet on 'row'
        resultSet.on( 'end', function () {
          done();
          // console.log( 'Sending eventsArray with:', eventsArray );
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
  console.log( 'In events POST:', req.users );
  if ( true ) { // req.isAuthenticated()
    // create object to save to database
    var databaseModel = {
      name: req.body.name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      creator: req.body.creator
    }; // end databaseModel

    // create new event in database
    pool.connect( function ( err, connection, done ) {
      // check if there was an error
      if ( err ) {
        console.log( err );
        res.status( 400 ).send( err );
      } else {
        console.log( 'Post new event to database' );
        connection.query( "INSERT INTO events ( name, description, start_date, end_date, creator ) VALUES( $1, $2, $3, $4, $5 ) RETURNING id", [ databaseModel.name, databaseModel.description, databaseModel.start_date, databaseModel.end_date, databaseModel.creator ], function ( err, results ) {
          done();
          var newEventId = results.rows[0].id;
          // console.log( 'newEventId:', newEventId );
          // create the days of the event
          var startDate = new Date( databaseModel.start_date );
          var endDate = new Date( databaseModel.end_date);
          var dayCount = ( Math.abs( endDate - startDate ) / 1000 / 60 / 60 / 24 ) + 1;
          console.log( 'dayCount', dayCount);
          Date.prototype.addDays = function( days ) {
            var dat = new Date( this.valueOf() );
            dat.setDate( dat.getDate() + days );
            return dat;
          }; // end new Date prototype
          var thisDay;
          console.log( 'startDate:', startDate );
          // loop through dayCount and insert new days into database
          for (var i = 0; i < dayCount; i++) {
            thisDay = startDate.addDays( i );
            console.log( 'day', i+1, thisDay );
            connection.query( "INSERT INTO event_days ( calendar_date, event_id ) VALUES ( $1, $2 )", [ thisDay, newEventId ] );
            done();
          } // end for loop

          res.status( 201 ).send( results );
        }); // end connection query
      } // end if else error check
    }); // end pool.connect

  } else {
    console.log( 'authentication error' );
    res.redirect( '/' );
  } // end isAuthenticated
}); // end base URL POST

// GET route for single event from database
router.get( '/singleEvent/:id?', function ( req, res ) {
  console.log( 'In events/singleEvent:', req.params.id );
  var singleEvent;
  if ( req.params.id === 'undefined') {
    res.status( 400 ).send( 'event Id required' );
    return;
  } else {
    eventsArray = [];
    if ( true ) { // req.isAuthenticated()
      // connect to database
      pool.connect( function ( err, connection, done ) {
        // check if there's an error
        if ( err ) {
          console.log( err );
          res.sendStatus( 400 );
        } else {
          console.log( 'Get single event from database' );
          var resultSet = connection.query( "SELECT * FROM events WHERE id=$1", [ req.params.id ] );
          resultSet.on( 'row', function ( row ) {
            singleEvent = row;
          }); // end resultSet on 'row'
          resultSet.on( 'end', function () {
            done();
            // console.log( 'Sending singleEvent with:', singleEvent );
            res.status( 200 ).send( singleEvent );
          }); // end resultSet on end
        } // end else if
      }); // end pool.connect
    } else {
      console.log( 'authentication error' );
      res.redirect( '/' );
    } // end isAuthenticated
  } // end if else empty req.params.id
}); // end /viewEvent GET

router.get( '/eventDays/:eventId', function ( req, res ) {

}); // end eventDays GET

module.exports = router;
