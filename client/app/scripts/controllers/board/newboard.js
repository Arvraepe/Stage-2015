'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:NewboardCtrl
 * @description
 * # NewboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('NewBoardCtrl', function ($scope, $modalInstance, projectId, states, boardRequestFactory, notificationFactory) {
    $scope.board={};
    $scope.dateFormat = 'dd-MMMM-yyyy';
    $scope.board.states = states;
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.disabledTime = function (date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };
    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.createBoard = function(){
      $scope.board.projectId = projectId;
      boardRequestFactory.createBoard({
        data : $scope.board,
        success:function(response){
          $modalInstance.close(response.data.board);
          notificationFactory.createNotification(response);
        },
        error: function(error){

        }
      })
    };

    $scope.getStates=function(){
      return $scope.standardStates;
    };


  });
