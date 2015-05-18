'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ChangeboardCtrl
 * @description
 * # ChangeboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ChangeBoardCtrl', function ($scope, $modalInstance, boardRequestFactory, board,ui) {
    $scope.boards = [];
    $scope.board = board;
    $scope.selectedBoard = {};
    $scope.getBoards = function () {
      var projectInformation = {
        projectId : board.parentProject._id
      };
      boardRequestFactory.getBoards({
        params:projectInformation,
        success: function (response) {
          angular.forEach(response.data.boards, function (board) {
            if(board._id!==$scope.board._id){
              $scope.boards.push(board);
            }
          });
        },
        error: function (error) {
          console.log(error);
        }
      })
    };

    $scope.returnBoard = function () {
      $modalInstance.close($scope.selectedBoard.board);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss(ui);
    };
  });
