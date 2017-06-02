myApp.controller( 'eventViewController', [ 'Events', 'eventFactory', function( Events, eventFactory ) {
  console.log( 'eventViewController' );
  var vm = this;
  vm.selectedEvent = Events.getSingleEvent( eventFactory.queuedEvent );

  // vm.selectedEvent = {
  //   name: eventSelected.name,
  //   description: eventSelected.description,
  //   startDate: eventSelected.startDate,
  //   endDate: eventSelected.endDate,
  //   creator: eventSelected.creator
  // }; // end selectedEvent


}]); // end eventViewController
