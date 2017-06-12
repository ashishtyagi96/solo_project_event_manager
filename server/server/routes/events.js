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
  // console.log( 'In events GET->',req.user );
  // empty eventsArray
  eventsArray = [];
  if ( req.isAuthenticated() ) { // req.isAuthenticated()
    // connect to database
    pool.connect( function ( err, connection, done ) {
      // check if there's an error
      if ( err ) {
        console.log( err );
        res.sendStatus( 400 );
      } else {
        console.log( 'Get all from database' );
        // query database
        var resultSet = connection.query( "SELECT * FROM events WHERE creator=$1 ORDER BY start_date", [ req.user.id ] );
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
  // console.log( 'In events POST:', req.users );
  if ( req.isAuthenticated() ) { // req.isAuthenticated()
    // create object to save to database
    var databaseModel = {
      name: req.body.name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      creator: req.user.id
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
          // console.log( 'dayCount', dayCount);
          Date.prototype.addDays = function( days ) {
            var dat = new Date( this.valueOf() );
            dat.setDate( dat.getDate() + days );
            return dat;
          }; // end new Date prototype
          var thisDay;
          // console.log( 'startDate:', startDate );
          // loop through dayCount and insert new days into database
          for (var i = 0; i < dayCount; i++) {
            thisDay = startDate.addDays( i );
            // console.log( 'day', i+1, thisDay );
            connection.query( "INSERT INTO event_days ( calendar_date, event_id ) VALUES ( $1, $2 ) RETURNING id", [ thisDay, newEventId ], function ( err, results ) {
              var newDayId = results.rows[0].id;
              done();
              connection.query( "INSERT INTO day_tasks ( day_id ) VALUES ( $1 )", [ newDayId ], function ( err, results) {
                done();
              }); // end query
            }); // end query

          } // end for loop

          res.status( 201 ).send( { results: results, newEventId: newEventId} );
        }); // end connection query
      } // end if else error check
    }); // end pool.connect

  } else {
    console.log( 'authentication error' );
    res.sendStatus( 401 );
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
    if ( req.isAuthenticated() ) { // req.isAuthenticated()
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
      res.sendStatus( 401 );
    } // end isAuthenticated
  } // end if else empty req.params.id
}); // end /viewEvent GET

router.get( '/eventDays/:eventId', function ( req, res ) {
  console.log( 'In eventDays, getting days for event:', req.params.eventId );
  if ( req.params.eventId === 'undefined') {
    res.status( 400 ).send( 'Event Id required' );
    return;
  } else {
    daysArray = [];
    if ( req.isAuthenticated() ) { // req.isAuthenticated()
      // connect to database
      pool.connect( function ( err, connection, done ) {
        // check if there's an error
        if ( err ) {
          console.log( err );
          res.sendStatus( 400 );
        } else {
          console.log( 'Get days of the event from database' );
          var resultSet = connection.query( "SELECT * FROM event_days WHERE event_id=$1", [ req.params.eventId ] );
          resultSet.on( 'row', function ( row ) {
            daysArray.push( row );
          }); // end resultSet on 'row'
          resultSet.on( 'end', function () {
            done();
            // console.log( 'Sending daysArray with:', daysArray );
            res.status( 200 ).send( daysArray );
          }); // end resultSet on end
        } // end else if
      }); // end pool.connect
    } else {
      console.log( 'authentication error' );
      res.sendStatus( 401 );
    } // end isAuthenticated
  } // end if else empty req.params.id
}); // end eventDays GET

// GET route for single days
router.get( '/singleDay/:id', function ( req, res ) {
  console.log( 'In singleDay, getting day with id:', req.params.id );
  if ( req.params.id === 'undefined') {
    res.status( 400 ).send( 'day Id required' );
    return;
  } else {
    var dayTasks = [];
    if ( req.isAuthenticated() ) { // req.isAuthenticated()
      // connect to database
      pool.connect( function ( err, connection, done ) {
        // check if there's an error
        if ( err ) {
          console.log( err );
          res.sendStatus( 400 );
        } else {
          console.log( 'Get day info from database' );
          var resultSet = connection.query( "SELECT * FROM day_tasks WHERE day_id=$1", [ req.params.id ] );
          resultSet.on( 'row', function ( row ) {
            dayTasks.push( row );
          }); // end resultSet on 'row'
          resultSet.on( 'end', function () {
            done();
            // console.log( 'Sending dayTasks with:', dayTasks );
            res.status( 200 ).send( dayTasks );
          }); // end resultSet on end
        } // end else if
      }); // end pool.connect
    } else {
      console.log( 'authentication error' );
      res.sendStatus( 401 );
    } // end isAuthenticated
  } // end if else empty req.params.id
}); // end singleDay GET

// POST route for creating day tasks
router.post( '/newTask', function ( req, res ) {
  console.log( 'in newTask POST:', req.body );
  var timeAdjusted;
  if ( req.body.am_pm === 'pm' ) {
    timeAdjusted = ( parseInt( req.body.activity_time ) + 12 ).toString();
    console.log( 'timeAdjusted:', timeAdjusted );
  } else {
    timeAdjusted = req.body.activity_time;
    console.log( 'timeAdjusted:', timeAdjusted );
  }
  pool.connect( function ( err, connection, done ) {
    // check if there's an error
    if ( err ) {
      console.log( err );
      res.sendStatus( 400 );
    } else {
      if ( req.isAuthenticated() ) {
        switch ( timeAdjusted ) {
          case '00':
            connection.query( "UPDATE day_tasks SET zero=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '01':
            connection.query( "UPDATE day_tasks SET one=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '02':
            connection.query( "UPDATE day_tasks SET two=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '03':
            connection.query( "UPDATE day_tasks SET three=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '04':
            connection.query( "UPDATE day_tasks SET four=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '05':
            connection.query( "UPDATE day_tasks SET five=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '06':
            connection.query( "UPDATE day_tasks SET six=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '07':
            connection.query( "UPDATE day_tasks SET seven=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '08':
            connection.query( "UPDATE day_tasks SET eight=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '09':
            connection.query( "UPDATE day_tasks SET nine=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '10':
            connection.query( "UPDATE day_tasks SET ten=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '11':
            connection.query( "UPDATE day_tasks SET eleven=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '12':
            connection.query( "UPDATE day_tasks SET twelve=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '13':
            connection.query( "UPDATE day_tasks SET thirteen=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '14':
            connection.query( "UPDATE day_tasks SET fourteen=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '15':
            connection.query( "UPDATE day_tasks SET fifteen=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '16':
            connection.query( "UPDATE day_tasks SET sixteen=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '17':
            connection.query( "UPDATE day_tasks SET seventeen=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '18':
            connection.query( "UPDATE day_tasks SET eighteen=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '19':
            connection.query( "UPDATE day_tasks SET nineteen=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '20':
            connection.query( "UPDATE day_tasks SET twenty=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '21':
            connection.query( "UPDATE day_tasks SET twenty_one=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '22':
            connection.query( "UPDATE day_tasks SET twenty_two=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          case '23':
            connection.query( "UPDATE day_tasks SET twenty_three=$1 WHERE day_id=$2", [ req.body.activity_description, req.body.day_id ], function (){
              done();
              res.sendStatus( 201 );
            }); // end connection.query
            break;
          default:
            console.log( 'problem with UPDATE!' );
        }

      } else {
        console.log( 'authentication error' );
        res.sendStatus( 401 );
      } // end isAuthenticated
    } // end if else eror
  }); // end pool.connect
}); // end newTask POST

module.exports = router;
