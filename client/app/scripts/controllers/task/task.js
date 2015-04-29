'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('TaskCtrl', function ($scope, $routeParams, taskRequestFactory, projectRequestFactory) {
    $scope.task = {};
    $scope.projectId = $routeParams.pid;
    $scope.boardId = $routeParams.boardId;
    $scope.isCollapsed = true;
    var taskId = {
      _id : $routeParams.taskId
    };

    $scope.getTaskInfo = function () {
      taskRequestFactory.getTask({
        params: taskId,
        success: function (response) {
          $scope.task = response.data.task;
          var projectId= {
            projectId: $routeParams.pid
          };
          projectRequestFactory.getCollaboratorsForProject({
            params: projectId,
            success:function(response){
              $scope.collaborators = response.data.members;
            },
            error: function(error){
              console.log(error);
            }
          })
        },
        error: function (error) {
          console.log(error);
        }
      })
    };

    $scope.makeComment = function(comment){
      var commentInfo = angular.copy(taskId);
      commentInfo.comment = comment;
     taskRequestFactory.createComment({
       data: commentInfo,
       success:function(response){

       },
       error: function(error){

       }
     })
    }


  });
