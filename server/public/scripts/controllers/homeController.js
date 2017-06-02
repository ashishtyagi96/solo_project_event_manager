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
    }); // end http GET /events
  }; // end getEvents

  vm.getEvents();

  vm.viewEvent = function ( eventId ) {
    eventFactory.queuedEvent = eventId;
    $location.path( '/eventView' );
    // Events.getSingleEvent( eventId );
  }; // end viewEvent
  // function ( eventId ) {
  //   console.log( 'In viewEvent:', eventId );
  //   $http({
  //     url: '/events/eventView/' + eventId,
  //     method: 'GET'
  //   }).then( function ( response ) {
  //     console.log('Success:', response.data);
  //     $location.path('/eventView');
  //   }, function ( response ) {
  //     console.log('Failed:', response.data);
  //   }); // end http GET /events/eventView
  // }; // end viewEvent

}]);
