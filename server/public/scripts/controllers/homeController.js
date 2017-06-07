myApp.controller( 'homeController', [ '$http', '$location', 'Events', '$uibModal', '$log', function( $http, $location, Events, $uibModal, $log ) {
  console.log( 'homeController' );
  var vm = this;

  vm.userName = 'Ben';
  // vm.eventsArray = Events.allEvents.events();
  vm.getEvents = function () {
    console.log('In getEvents');
    $http({
      url: '/events',
      method: 'GET'
    }).then( function ( response ) {
      console.log('Success:');
      var currentEvents = [];
      var pastEvents = [];
      var today = new Date();
      // loop through response array and sort events by upcoming/current and past events based on end date
      for (var i = 0; i < response.data.length; i++) {
        var endDate = response.data[i].end_date;
        var startDate = response.data[i].start_date;
        // convert dates to Date objects without timestamp
        response.data[i].end_date = {
          originalDate: new Date( endDate ),
          dateString: new Date( endDate.slice( 5, 7 ) + "-" + endDate.slice( 8, 10 ) + "-" + endDate.slice( 0, 4 ) )
        }; // end end_date object
        response.data[i].start_date = {
          originalDate: startDate,
          dateString: new Date( startDate.slice( 5, 7 ) + "-" + startDate.slice( 8, 10 ) + "-" + startDate.slice( 0, 4 ) )
        }; // end start_date object
        if ( response.data[i].end_date.dateString < today ) {
          pastEvents.push( response.data[i] );
        } else {
          currentEvents.push( response.data[i] );
        }
      }
      vm.currentEventsArray = currentEvents;
      vm.pastEventsArray = pastEvents;
    }, function ( response ) {
      console.log('Failed:', response.data);
      $location.path( '/' );
    }); // end http GET /events
  }; // end getEvents

  vm.getEvents();

  vm.logout = function () {
    $http.get( '/users/logout' ).then( function ( response ) {
      console.log( 'logged out' );
      $location.path( '/' );
    }); // end logout GET
  }; // end vm.logout

  vm.viewEvent = function ( eventId ) {
    // eventFactory.queuedEvent = eventId;
    $location.path( '/eventView/' + eventId );
    // Events.getSingleEvent( eventId );
  }; // end viewEvent

  vm.createNewEvent = function ( objectToSend ) {
    console.log( 'creating new event' );

    $http.post( '/events', objectToSend ).then( function ( response ) {
      console.log( 'new event created' );
      // route to the new event
      $location.path( '/eventView/' + response.data.newEventId );
    }); // end /events POST
  }; // end createNewEvent

  vm.open = function (size, parentSelector) {
    vm.animationsEnabled = true;
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.create-event-modal' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'createEventModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: 'cem',
      size: size,
      appendTo: parentElem,
      resolve: {
        title: function () {
          return vm.newEventObject;
        } //
      } // end resolve
    }).result.then( function ( result ) {
      // console.log( 'vm.open result:', result );
      if ( result ) {
        console.log('create new event');
        vm.createNewEvent( result );
      } else {
        return;
      } // end if else empty result
    }); // end ModalInstance
  }; // end open
}]); // end myApp homeController

// modal controller
myApp.controller( 'ModalInstanceCtrl', [ '$uibModalInstance', function ( $uibModalInstance ){
  console.log( 'ModalInstanceCtrl hit' );
  var vm =this;
  vm.alerted = false;

  // when ok button is clicked on modal
  vm.ok = function (){
    // check for empty fields
    if ( !vm.newEventName || !vm.newEventDescription || !vm.start_date || !vm.end_date ) {
      console.log( 'fields empty' );
      vm.alertMessage = 'Please Fill All Fields';
      vm.alerted = true;
      return;
    }
    // create object of new event
    vm.newEventObject = {
      name: vm.newEventName,
      description: vm.newEventDescription,
      start_date: vm.start_date,
      end_date: vm.end_date,
      creator: '1'
    }; // end objectToSend
    // close modal and pass the newEventObject
    $uibModalInstance.close( vm.newEventObject );
  };

  // when cancel button is clicked on modal
  vm.cancel = function () {
    // close modal without passing any data
    $uibModalInstance.close();
  };
}]);
