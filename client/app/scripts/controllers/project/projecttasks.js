'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectTasksCtrl
 * @description
 * # ProjectusersCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ProjectTasksCtrl', function ($scope, projectRequestFactory, projectId, $modalInstance) {
    $scope.tasks = [];
    $scope.selectedTask = {};
    $scope.getTasks = function(){
      var projectInfo = {
        projectId : projectId
      };
      projectRequestFactory.getTasks({
        params: projectInfo,
        success: function(response){
          $scope.tasks = response.data.tasks;
        },
        error: function(error){
          console.log(error);
        }
      })
    };

    $scope.returnTask = function () {
      $modalInstance.close($scope.selectedTask.task);
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
