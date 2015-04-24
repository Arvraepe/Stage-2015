'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:DeleteboardCtrl
 * @description
 * # DeleteboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('DeleteBoardCtrl', function ($scope, boardRequestFactory, board, notificationFactory, $modalInstance) {
    $scope.board = board;

    $scope.deleteBoard = function () {
      var boardId = {
        _id : $scope.board._id,
        projectId : $scope.board.projectId
      };
      boardRequestFactory.deleteBoard({
        params: boardId,
        success: function(response){
          notificationFactory.createNotification(response);
          $modalInstance.close($scope.board);
        },
        error: function(error){
          console.log(error);
        }

      })
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
