myApp.controller( 'eventViewController', [ 'Events', '$http', '$routeParams', '$location', '$uibModal', '$log', function( Events, $http, $routeParams, $location, $uibModal, $log ) {
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
          resolve: {
            selectedDay: function(){
              return vm.singleDay;
            }
          } // end resolve
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
myApp.controller( 'DayModalInstanceCtrl', [ 'Events' ,'$uibModalInstance', 'selectedDay', '$uibModal', '$log', function ( Events, $uibModalInstance, selectedDay, $uibModal, $log ){
  console.log( 'DayModalInstanceCtrl hit:', selectedDay );
  var vm =this;
  vm.alerted = false;
  vm.title = selectedDay.calendar_date.split( 'T', 1 )[0];
  Events.getSingleDay( selectedDay.id ).then( function ( data ) {
    // console.log( 'data 102:', data );
    vm.dayActivities = data[0];
    // console.log(vm.dayActivities);
  }); // end getDayActivities

  //when newActivity button is pressed
  vm.open = function ( size, parentSelector ) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.activity-modal' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'activityModalContent.html',
      controller: 'activityModalInstanceCtrl',
      controllerAs: 'amic',
      size: size,
      appendTo: parentElem,
      resolve: {
        selectedDay: selectedDay
      }
    }).result.then( function ( result ) {
      Events.getSingleDay( selectedDay.id ).then( function ( data ) {
        // console.log( 'data 102:', data );
        vm.dayActivities = data[0];
        // console.log(vm.dayActivities);
      }); // end getDayActivities
    }); // end modalInstance
  }; // end newActivity

  // when ok button is clicked on modal
  vm.ok = function () {
    // close modal
    $uibModalInstance.close();
  }; // end ok

  // when cancel button is clicked on modal
  vm.cancel = function () {
    // close modal
    $uibModalInstance.close();
  }; // end cancel

}]); // end DayModalInstanceCtrl

myApp.controller( 'activityModalInstanceCtrl', [ '$uibModalInstance', '$uibModal', '$log', 'selectedDay', 'Events', function ( $uibModalInstance, $uibModal, $log, selectedDay, Events ) {
  var vm = this;
  vm.title = 'Add a new activity';
  vm.isDaily = false;

  console.log( 'in activityModalInstanceCtrl, selectedDay:', selectedDay );

  // when save button is clicked on modal
  vm.save = function () {
    var activityObject = {
      activity_time: vm.timeIn,
      activity_description: vm.newActivityDescription,
      calendar_date: selectedDay.calendar_date,
      day_id: selectedDay.id,
      am_pm: vm.amPm
    }; // end activityObject
    console.log( 'activityObject:', activityObject );
    Events.createNewTask( activityObject ).then( function ( response ) {
      // close modal
      $uibModalInstance.close();
    }); // end createNewTask
  }; // end ok

  // when cancel button is clicked on modal
  vm.cancel = function () {
    // close modal
    $uibModalInstance.close();
  }; // end cancel
}]); // end activityModalInstanceCtrl
