console.log('client.js');
var myApp = angular.module( 'myApp', [ 'ngRoute', 'ui.bootstrap' ] );

myApp.config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
  $routeProvider
  .when( '/events', {
    templateUrl: '../views/routes/events.html',
    controller: 'eventsController',
    controllerAs: 'ec'
  })
  .when( '/eventView/:selectedEvent?', {
    templateUrl: '../views/routes/eventView.html',
    controller: 'eventViewController',
    controllerAs: 'evc'
  })
  .when( '/home', {
    templateUrl: '../views/routes/home.html',
    controller: 'homeController',
    controllerAs: 'hc'
  })
  .when( '/login', {
    templateUrl: '../views/routes/login.html',
    controller: 'loginController',
    controllerAs: 'lc'
  })
  .when( '/register', {
    templateUrl: '../views/routes/register.html',
    controller: 'registerController',
    controllerAs: 'rc'
  })
  .otherwise( '/login' );

  // $locationProvider.html5Mode( true );
}]); // end myApp.config

// .when( '/', {
//   template: '<h1>Select a route<h1>',
//   controller: 'mainController',
//   controllerAs: 'dc'
// })
