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
      boardRequestFactory.updateBoard({
        data : $scope.board,
        success:function(response){
          $modalInstance.close(response.data.board);
          notificationFactory.createNotification(response);
        },
        error: function(error){

        }
      })
    };



    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


  });
