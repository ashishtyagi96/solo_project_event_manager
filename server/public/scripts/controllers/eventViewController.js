myApp.controller( 'eventViewController', [ 'Events', '$routeParams', '$location', function( Events, $routeParams, $location ) {
  console.log( 'eventViewController' );
  var vm = this;
  Events.getSingleEvent( $routeParams.selectedEvent ).then( function ( data ) {
    // convert dates to Date objects without timestamp
    data.end_date = {
      originalDate: data.end_date,
      dateString: data.end_date.slice( 5, 7 ) + "-" + data.end_date.slice( 8, 10 ) + "-" + data.end_date.slice( 0, 4 )
    }; // end end_date object
    data.start_date = {
      originalDate: data.start_date,
      dateString: data.start_date.slice( 5, 7 ) + "-" + data.start_date.slice( 8, 10 ) + "-" + data.start_date.slice( 0, 4 )
    }; // end start_date object
    vm.selectedEvent = data;
  }); // end Event.getSingleEvent

  // get the days of this events
  Events.getDays( $routeParams.selectedEvent ).then( function ( data ) {
    console.log( 'getDays data:', data );
    vm.daysArray = data;
  }); // end getDays

  vm.viewDay = function ( dayId ) {
    console.log( 'viewDay:', dayId );
    vm.singleDay = Events.getSingleDay( dayId ).then( function (data) {
      console.log( 'singleDay:', vm.singleDay );
    }); // end callback
  }; // end viewDay

  vm.back = function () {
    console.log( 'going back a page' );
    $location.path( '/home' );
  }; // end back

}]); // end eventViewController
