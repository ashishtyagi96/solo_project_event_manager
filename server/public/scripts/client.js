console.log('client.js');
var myApp = angular.module( 'myApp', [ 'ngRoute' ] );

myApp.config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
  $routeProvider
  .when( '/events', {
    templateUrl: '../views/routes/events.html',
    controller: 'eventsController',
    controllerAs: 'ec'
  })
  .when( '/eventView', {
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
  .otherwise( '/login' );

  $locationProvider.html5Mode( true );
}]); // end myApp.config

// .when( '/', {
//   template: '<h1>Select a route<h1>',
//   controller: 'mainController',
//   controllerAs: 'dc'
// })
