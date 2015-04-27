'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('TaskCtrl', function ($scope, $routeParams, taskRequestFactory) {
    $scope.task = {};
    $scope.getTaskInfo = function () {
      taskRequestFactory.getTask({
        params: $routeParams.taskId,
        success: function (response) {
          $scope.task = response.data;
        },
        error: function (error) {
          console.log(error);
        }
      })
    };


  });
