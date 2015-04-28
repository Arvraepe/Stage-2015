'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:BoardCtrl
 * @description
 * # BoardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('BoardCtrl', function ($scope, $routeParams, boardRequestFactory,$modal) {
    $scope.board = {};
    $scope.amountOfStates = 0;
    $scope.columnWidth = 0;


    $scope.getBoardInfo = function(){
        var boardName = {
          boardId:$routeParams.boardId
        };
        boardRequestFactory.getBoardInfo({
          params: boardName,
          success:function(response){
            $scope.board = response.data.board;
            $scope.amountOfStates = $scope.board.states.length;
            $scope.columnWidth= Math.floor(12/$scope.amountOfStates);
            $scope.board.collaborators = response.data.collaborators;
            $scope.board.collaborators.push(angular.copy(response.data.leader));
            $scope.board.leader = response.data.leader;
          },
          error: function(error){
            console.log(error);
          }
        })
    };

    $scope.openEditBoardModal = function(size){
      var modalInstance = $modal.open({
        templateUrl: 'views/board/editboard.html',
        controller: 'EditBoardCtrl',
        size: size,
        resolve:{
          board: function(){
            return $scope.board;
          }
        }
      });
      modalInstance.result.then(function (data) {
        $scope.board = data;
        $scope.amountOfStates = $scope.board.states.length;
        $scope.columnWidth= Math.floor(12/$scope.amountOfStates);
      }, function () {
      })
    };

    $scope.openCreateTaskModal = function(size){
      var modalInstance = $modal.open({
        templateUrl: 'views/task/createtask.html',
        controller: 'CreateTaskCtrl',
        size: size,
        resolve:{
          board: function(){
            return $scope.board;
          }
        }
      });
      modalInstance.result.then(function (task) {
        $scope.board.states[0].tasks.push(task);
      }, function () {
      })
    };

    $scope.taskSortOptions = {
      itemMoved:function(event){
        event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
      },
      orderChanged: function(event){

      },
    }




  });
