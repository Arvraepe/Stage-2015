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
    $scope.states =[];
    function getStatesFromBoard(){
      angular.forEach($scope.board.states, function(state){
        $scope.states.push(state.name);
      })
    }
    getStatesFromBoard();




    $scope.updateBoard = function(){
      $scope.$broadcast('show-errors-check-validity');
      if($scope.editBoardForm.$valid){
        //var boardInfo = angular.copy($scope.board);
        var boardInfo = {
          _id : $scope.board._id,
          projectId : $scope.board.projectId,
          name : $scope.board.name,
          description : $scope.board.description,
          deadline:$scope.board.deadline,
          states : $scope.states
        };
        //boardInfo.states = $scope.states;

        boardRequestFactory.updateBoard({
          data : boardInfo,
          success:function(response){
            $modalInstance.close(response.data.board);
            notificationFactory.createNotification(response);
          },
          error: function(error){

          }
        });
      }

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
