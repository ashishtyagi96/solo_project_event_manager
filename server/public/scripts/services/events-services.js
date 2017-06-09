myApp.service( 'Events', [ '$http', '$location', function ( $http, $location ) {
  // get all events
  this.allEvents = {
    events: function () {
      return $http({
        url: '/events',
        method: 'GET'
      }).then( function ( response ) {
        console.log('Success:', response.data);
        return response.data.events;
      }, function ( response ) {
        console.log('Failed:', response.data);
        $location.path( '/' );
        return response;
      }); // end http GET /events
    } // end events
  }; // end allEvents

  // get data for a single event
  this.getSingleEvent = function ( eventId ) {
    console.log( 'In getSingleEvent:', eventId );
    return $http({
      url: '/events/singleEvent/' + eventId,
      method: 'GET'
    }).then( function ( response ) {
      console.log('Success:', response.data);
      return response.data;
    }, function ( response ) {
      console.log('Failed:', response.data);
      $location.path( '/' );
    }); // end http GET /events/singleEvent
  }; // end getSingleEvent

  // get the days for the given event
  this.getDays = function ( eventId ) {
    console.log( 'In getDays:', eventId );
    return $http({
      url: '/events/eventDays/' + eventId,
      method: 'GET'
    }).then( function ( response ) {
      console.log('Success:', response.data);
      return response.data;
    }, function ( response ) {
      console.log('Failed:', response.data);
      $location.path( '/' );
    }); // end http GET /events/getDays
  }; // end getDays

  // get single day
  this.getSingleDay = function ( dayId ) {
    console.log( 'In getSingleDay:', dayId );
    return $http({
      url: '/events/singleDay/' + dayId,
      method: 'GET'
    }).then( function ( response ) {
      console.log('Success:', response.data);
      return response.data;
    }, function ( response ) {
      console.log('Failed:', response.data);
      $location.path( '/' );
    }); // end http GET /events/getSingleDay
  }; // end singleDay

}]); // end Events service
