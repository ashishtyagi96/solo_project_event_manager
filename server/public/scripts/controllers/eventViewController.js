myApp.controller( 'eventViewController', [ 'Events', '$routeParams', function( Events, $routeParams ) {
  console.log( 'eventViewController' );
  var vm = this;
  Events.getSingleEvent( $routeParams.selectedEvent ).then( function ( data ) {
    // convert dates to Date objects without timestamp
    data.end_date = ( new Date( data.end_date.slice( 0, 10 ) ) ).toLocaleDateString();
    data.start_date = ( new Date( data.start_date.slice( 0, 10 ) ) ).toLocaleDateString();
    console.log('data:', data);
    vm.selectedEvent = data;
  }); // end Event.getSingleEvent


}]); // end eventViewController
