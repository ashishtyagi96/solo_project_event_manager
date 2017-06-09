myApp.controller( 'eventViewController', [ 'Events', '$routeParams', '$location', '$uibModal', '$log', function( Events, $routeParams, $location, $uibModal, $log ) {
  console.log( 'eventViewController' );
  var vm = this;
  Events.getSingleEvent( $routeParams.selectedEvent ).then( function ( data ) {
    // convert dates to Date objects without timestamp
    data.end_date = {
      originalDate: data.end_date,
      dateString: data.end_date.slice( 5, 7 ) + "-" + data.end_date.slice( 8, 10 ) + "-" + data.end_date.slice( 0, 4 )
    }; // end end_date object
    data.start_date = {
      originalDate: data.start_date,
      dateString: data.start_date.slice( 5, 7 ) + "-" + data.start_date.slice( 8, 10 ) + "-" + data.start_date.slice( 0, 4 )
    }; // end start_date object
    vm.selectedEvent = data;
  }); // end Event.getSingleEvent

  // get the days of this events
  Events.getDays( $routeParams.selectedEvent ).then( function ( data ) {
    console.log( 'getDays data:', data );
    vm.daysArray = data;
  }); // end getDays

  vm.viewDay = function ( day, size, parentSelector ) {
    console.log( 'viewDay:', day.id );
    Events.getSingleDay( day.id ).then( function ( data ){
      vm.singleDay = day;
      console.log( 'singleDay:', vm.singleDay );
      vm.daySelected = vm.singleDay.calendar_date;
      // open day modal when clicking a day
      // vm.open = function ( size, parentSelector ) {
        vm.animationsEnabled = true;
        var parentElem = parentSelector ?
          angular.element( $document[0].querySelector( '.view-day-modal' + parentSelector ) ) : undefined;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'viewDayModal.html',
          controller: 'DayModalInstanceCtrl',
          controllerAs: 'vdm',
          size: size,
          appendTo: parentElem,
          resolve: {} // end resolve
        }).result.then( function ( result ) {
          // console.log( 'vm.open result:', result );
          if ( result ) {
            console.log( 'result:', result );
          } else {
            return;
          } // end if else empty result
        }); // end ModalInstance
    }); // getSingleDay

      // }; // end open

    // }); // end callback
  }; // end viewDay

  vm.back = function () {
    console.log( 'going back a page' );
    $location.path( '/home' );
  }; // end back

  vm.logout = function () {
    $http.get( '/users/logout' ).then( function ( response ) {
      console.log( 'logged out' );
      $location.path( '/' );
    }); // end logout GET
  }; // end vm.logout

}]); // end eventViewController

// modal controller
myApp.controller( 'DayModalInstanceCtrl', [ '$uibModalInstance', function ( $uibModalInstance ){
  console.log( 'DayModalInstanceCtrl hit' );
  var vm =this;
  vm.alerted = false;

  //Datepicker stuff
  vm.today = function() {
    vm.start_date = new Date();
  };
  vm.today();

  vm.options = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  vm.toggleMin = function() {
    vm.options.minDate = vm.options.minDate ? null : new Date();
  };

  vm.toggleMin();

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < vm.events.length; i++) {
        var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return vm.events[i].status;
        }
      }
    }

    return '';
  }

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
      creator: ''
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
