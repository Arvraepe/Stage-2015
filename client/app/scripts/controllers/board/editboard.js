'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:EditboardCtrl
 * @description
 * # EditboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('EditBoardCtrl', function ($scope, $modalInstance, board, boardRequestFactory,notificationFactory) {
    $scope.board = angular.copy(board);

    $scope.updateBoard = function(){
      $scope.$broadcast('show-errors-check-validity');
      if($scope.editBoardForm.$valid){
        boardRequestFactory.updateBoard({
          data : $scope.board,
          success:function(response){
            $modalInstance.close(response.data.board);
            notificationFactory.createNotification(response);
          },
          error: function(error){

          }
        });
      }

    };


    $scope.dateFormat = 'dd-MMMM-yyyy';
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


  });
