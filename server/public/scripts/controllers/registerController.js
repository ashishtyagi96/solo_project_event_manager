myApp.controller( 'registerController', [ '$http', '$location', function( $http, $location ) {
  console.log( 'registerController' );
  var vm = this;

  vm.message = '';

  vm.userCredentials = {
    userEmail: '',
    password: '',
    passwordRetype: ''
  };

  vm.register = function () {
    // check for non-valid email and password entries or empty fields
    console.log( 'userCredentials->', vm.userCredentials );
    if ( vm.userCredentials.userEmail === '' || vm.userCredentials.password === '' ) {
      vm.message = 'Please enter your Email address and password';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else if ( vm.userCredentials.userEmail.includes( '@' ) === false || vm.userCredentials.userEmail.includes( '.' ) === false ) {
      vm.message = 'Please enter a valid Email address';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else {
      console.log( 'sending credentials to register' );
      $http.post( '/register', vm.userCredentials ).then( function ( response ) {
        console.log( 'registration successful' );
        vm.message = 'Registration Successful!';
        setTimeout( function() {
          $location.path( '/login' );
        }, 2000 );
      },
      function ( response ) {
        console.log( 'registration failed' );
        vm.message = 'Registration Failed!';
        setTimeout( function() {
          vm.message = '';
        }, 1 );
      }); // end $http post
    } // end if else input field verification
  }; // end register
}]); // end registerController
