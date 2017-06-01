myApp.controller( 'homeController', [ '$http', function( $http ) {
  console.log( 'homeController' );
  var vm = this;

  vm.userName = 'Ben';
  vm.getEvents = function () {
    console.log('In getEvents');
    $http({
      url: '/events',
      method: 'GET'
    }).then( function ( response ) {
      console.log('Success:', response);
    }).then( function ( response ) {
      console.log('Failed:', response);
    }); // end http GET /events
  }; // end getEvents

  vm.getEvents();

}]);
