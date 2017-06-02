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
      vm.eventsArray = response.data;
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
