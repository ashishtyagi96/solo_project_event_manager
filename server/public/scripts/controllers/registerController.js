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
    if ( vm.userCredentials.userEmail === '' || vm.userCredentials.password === '' || vm.userCredentials.passwordRetype === '' ) {
      vm.message = 'Please enter your Email address and password';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else if ( vm.userCredentials.userEmail.includes( '@' ) === false || vm.userCredentials.userEmail.includes( '.' ) === false ) {
      vm.message = 'Please enter a valid Email address';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else if ( vm.userCredentials.password !== vm.userCredentials.passwordRetype ) {
      vm.message = 'Passwords must match!';
      vm.userCredentials.password = '';
      vm.userCredentials.passwordRetype = '';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else {
      console.log( 'sending credentials to register' );
      $http.post( '/register', vm.userCredentials ).then( function ( response ) {
        console.log( 'registration successful' );
        vm.message = 'Registration Successful!';
        vm.userCredentials.password = '';
        vm.userCredentials.passwordRetype = '';
        setTimeout( function() {
          $location.path( '/login' );
        }, 1 );
      },
      function ( response ) {
        console.log( 'registration failed' );
        vm.message = 'Registration Failed!';
        vm.userCredentials.password = '';
        vm.userCredentials.passwordRetype = '';
        setTimeout( function() {
          vm.message = '';
        }, 1 );
      }); // end $http post
    } // end if else input field verification
  }; // end register
}]); // end registerController
