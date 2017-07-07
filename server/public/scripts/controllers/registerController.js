myApp.controller( 'registerController', [ '$http', '$location', function( $http, $location ) {
  console.log( 'registerController' );
  var vm = this;

  vm.message = '';

  vm.userCredentials = {
    user_email: '',
    user_password: '',
    user_passwordRetype: '',
    first_name: '',
    last_name: ''
  };

  vm.register = function () {

    var userCreds = vm.userCredentials;

    // check for non-valid email, user_password, and name entries or empty fields
    // console.log( 'userCredentials->', vm.userCredentials );
    if ( userCreds.user_email === '' || userCreds.user_password === '' || userCreds.user_passwordRetype === '' || userCreds.first_name === '' || userCreds.last_name === '') {
      vm.message = 'Please enter your Email address, password, and Name';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else if ( userCreds.user_email.includes( '@' ) === false || userCreds.user_email.includes( '.' ) === false ) {
      vm.message = 'Please enter a valid Email address';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else if ( userCreds.user_password !== userCreds.user_passwordRetype ) {
      vm.message = 'passwords must match!';
      vm.userCredentials.user_password = '';
      vm.userCredentials.user_passwordRetype = '';
      setTimeout( function(){
        vm.message = '';
      }, 1 );
    } else {
      console.log( 'sending credentials to register' );
      $http.post( '/register', userCreds ).then( function ( response ) {
        console.log( 'registration successful' );
        vm.message = 'Registration Successful!';
        $http.post( '/', vm.userCredentials ).then( function( response ) {
            console.log( 'credentials verified, directing to home page', response );
            // direct user to home page
            $location.path( '/home' );
            // setTimeout( function(){
            //   vm.message = '';
            // }, 1 );
        });
      },
      function ( response ) {
        console.log( 'registration failed:', response );
        vm.message = 'Registration Failed!';
        vm.userCredentials.user_password = '';
        vm.userCredentials.user_passwordRetype = '';
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
