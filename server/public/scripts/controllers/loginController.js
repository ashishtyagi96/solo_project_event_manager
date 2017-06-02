myApp.controller( 'loginController', [ '$http', '$location', function( $http, $location ) {
  console.log( 'loginController' );
  var vm = this;


  vm.userCredentials = {
    userEmail: '',
    password: '',
  };

  // alert dialog for incorrect username and password
  vm.message = '';

  // when login button is clicked, verify userCredentials
  vm.login = function () {
    // check for non-valid email and password entries or empty fields
    // console.log( 'userCredentials->', vm.userCredentials );
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
      // send credentials to server to valid user
      console.log( 'checking credentials...', vm.userCredentials );
      $http.post( '/', vm.userCredentials ).then( function( response ) {
          console.log( 'credentials verified, directing to home page', response );
          // direct user to home page
          // $location.path( '/home' );
          // setTimeout( function(){
          //   vm.message = '';
          // }, 1 );
      }
      // ,
      // function( response ) {
      //   console.log( 'verification failed' );
      //   vm.message = 'Incorrect Email or password';
      //   vm.userCredentials.password = '';
      //   setTimeout( function(){
      //     vm.message = '';
      //   }, 1 );
      // }
    ); // end login post
    } // end if else input checking
  }; // end vm.login

  // when registration button is clicked, route to /register
  vm.register = function () {
    console.log( 'register selected, redirecting' );
    $location.path('/register');
  }; // end vm.register
}]); // end loginController
