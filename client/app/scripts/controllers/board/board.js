'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:BoardCtrl
 * @description
 * # BoardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('BoardCtrl', function ($scope, $routeParams, boardRequestFactory) {
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


          },
          error: function(error){
            console.log(error);
          }
        })
    };




  });
