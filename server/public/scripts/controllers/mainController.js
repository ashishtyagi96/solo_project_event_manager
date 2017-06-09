myApp.controller( 'mainController', [ '$http', '$location', function( $http, $location ) {
  console.log( 'mainController' );
  var vm = this;
  vm.logout = function (){
    console.log( 'logging out' );
    $http({
      method: 'GET',
      url: '/users/logout'
    }).then( function () {
      $location.path( '/' );
    });
  }; // end logout
}]); // end mainController
