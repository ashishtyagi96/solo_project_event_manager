myApp.service( 'Events', [ '$http', '$location', 'eventFactory', function ( $http, $location, eventFactory ) {
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
        return response;
      }); // end http GET /events
    } // end events
  }; // end allEvents


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
    }); // end http GET /events/eventView
  }; // end getSingleEvent

}]); // end Events service
