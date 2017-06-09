myApp.controller( 'registerController', [ '$http', '$location', function( $http, $location ) {
  console.log( 'registerController' );
  var vm = this;

  vm.message = '';

  vm.userCredentials = {
    userEmail: '',
    password: '',
    passwordRetype: '',
    firstname: '',
    lastname: ''
  };

  vm.register = function () {

    var userCreds = vm.userCredentials;

    // check for non-valid email, password, and name entries or empty fields
    // console.log( 'userCredentials->', vm.userCredentials );
    if ( userCreds.userEmail === '' || userCreds.password === '' || userCreds.passwordRetype === '' || userCreds.firstname === '' || userCreds.lastname === '') {
      vm.message = 'Please enter your Email address, Password, and Name';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else if ( userCreds.userEmail.includes( '@' ) === false || userCreds.userEmail.includes( '.' ) === false ) {
      vm.message = 'Please enter a valid Email address';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else if ( userCreds.password !== userCreds.passwordRetype ) {
      vm.message = 'Passwords must match!';
      vm.userCredentials.password = '';
      vm.userCredentials.passwordRetype = '';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else {
      console.log( 'sending credentials to register' );
      $http.post( '/register', userCreds ).then( function ( response ) {
        console.log( 'registration successful' );
        vm.message = 'Registration Successful!';
        vm.userCredentials.password = '';
        vm.userCredentials.passwordRetype = '';
        // setTimeout( function() {
        //   $location.path( '/login' );
        // }, 1 );
      },
      function ( response ) {
        console.log( 'registration failed:', response );
        vm.message = 'Registration Failed!';
        vm.userCredentials.password = '';
        vm.userCredentials.passwordRetype = '';
        setTimeout( function() {
          vm.message = '';
        }, 1 );
      }); // end $http post
    } // end if else input field verification
  }; // end register

  // go back a page
  vm.back = function () {
    console.log( 'going back a page' );
    $location.path( '/login' );
  }; // end back
}]); // end registerController
