myApp.controller( 'homeController', [ '$http', '$location', 'Events', function( $http, $location, Events ) {
  console.log( 'homeController' );
  var vm = this;

  vm.userName = 'Ben';
  // vm.eventsArray = Events.allEvents.events();
  vm.getEvents = function () {
    console.log('In getEvents');
    $http({
      url: '/events',
      method: 'GET'
    }).then( function ( response ) {
      console.log('Success:', response.data);
      var currentEvents = [];
      var pastEvents = [];
      var today = new Date();
      // loop through response array and sort events by upcoming/current and past events based on end date
      for (var i = 0; i < response.data.length; i++) {
        var endDate = response.data[i].end_date;
        var startDate = response.data[i].start_date;
        // convert dates to Date objects without timestamp
        response.data[i].end_date = {
          originalDate: new Date( endDate ),
          dateString: new Date( endDate.slice( 5, 7 ) + "-" + endDate.slice( 8, 10 ) + "-" + endDate.slice( 0, 4 ) )
        }; // end end_date object
        response.data[i].start_date = {
          originalDate: startDate,
          dateString: new Date( startDate.slice( 5, 7 ) + "-" + startDate.slice( 8, 10 ) + "-" + startDate.slice( 0, 4 ) )
        }; // end start_date object
        if ( response.data[i].end_date.dateString < today ) {
          pastEvents.push( response.data[i] );
        } else {
          currentEvents.push( response.data[i] );
        }
      }
      vm.currentEventsArray = currentEvents;
      vm.pastEventsArray = pastEvents;
    }, function ( response ) {
      console.log('Failed:', response.data);
      $location.path( '/' );
    }); // end http GET /events
  }; // end getEvents

  vm.getEvents();

  vm.logout = function () {
    $http.get( '/users/logout' ).then( function ( response ) {
      console.log( 'logged out' );
      $location.path( '/' );
    }); // end logout GET
  }; // end vm.logout

  vm.viewEvent = function ( eventId ) {
    // eventFactory.queuedEvent = eventId;
    $location.path( '/eventView/' + eventId );
    // Events.getSingleEvent( eventId );
  }; // end viewEvent

  vm.createNewEvent = function () {
    console.log( 'creating new event' );
    var objectToSend = {
      name: 'Create test',
      description: 'this is a test event to test the create route',
      start_date: '2017-06-05',
      end_date: '2017-06-08',
      creator: '1'
    }; // end objectToSend
    $http.post( '/events', objectToSend ).then( function ( response ) {
      console.log( 'new event created', response );
    }); // end /events POST
  }; // end createNewEvent
}]); // end myApp homeController
