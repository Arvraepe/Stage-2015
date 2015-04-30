'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('TaskCtrl', function ($scope, $routeParams, taskRequestFactory, projectRequestFactory, editorFactory) {
    $scope.task = {};
    $scope.projectId = {
      projectId:$routeParams.pid
    };
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
          projectRequestFactory.getCollaboratorsForProject({
            params: $scope.projectId,
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

    $scope.createComment = function(comment){
      taskId.comment = comment;
     taskRequestFactory.createComment({
       data: taskId,
       success:function(response){
         $scope.task.comments.push(response.data.comment);
         taskId = {
           _id : $routeParams.taskId
         };
       },
       error: function(error){
          console.log(error);
       }
     })
    };

    $scope.createStyle = function (sort, inputField) {
      editorFactory.createStyle(sort, inputField);
    };
    $scope.comment='';


  });
