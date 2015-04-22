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

    $scope.getBoardInfo = function(){
        var boardName = {
          boardId:$routeParams.boardName
        };
        boardRequestFactory.getBoardInfo({
          params: boardName,
          success:function(response){
            $scope.board = response.data;
          },
          error: function(error){
            console.log(error);
          }
        })
    };




  });
