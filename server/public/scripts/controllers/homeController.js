myApp.controller( 'homeController', [ '$http', '$location', 'Events', 'eventFactory', function( $http, $location, Events, eventFactory ) {
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
      for (var i = 0; i < response.data.length; i++) {
        if ( response.data[i].endDate < today ) {
          pastEvents.push( response.data[i] );
        } else {
          currentEvents.push( response.data[i] );
        }
      }
      vm.currentEventsArray = currentEvents;
      vm.pastEventsArray = pastEvents;
    }, function ( response ) {
      console.log('Failed:', response.data);
      // $location.path( '/' );
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
    eventFactory.queuedEvent = eventId;
    $location.path( '/eventView' );
    // Events.getSingleEvent( eventId );
  }; // end viewEvent
}]);
