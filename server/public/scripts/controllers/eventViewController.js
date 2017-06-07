myApp.controller( 'eventViewController', [ 'Events', '$routeParams', function( Events, $routeParams ) {
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

}]); // end eventViewController
