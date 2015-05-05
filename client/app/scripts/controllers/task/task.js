'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('TaskCtrl', function ($scope, $routeParams, taskRequestFactory, projectRequestFactory, $modal, $location, $anchorScroll) {
    $scope.task = {};
    $scope.projectId = {
      projectId:$routeParams.pid
    };
    $scope.isCreator = function(){
      return $scope.task.creator._id ===$scope.$parent.currentUser._id;
    };
    $scope.boardId = $routeParams.boardId;
    $scope.isCollapsed = true;
    var taskId = {
      _id : $routeParams.taskId
    };

    $scope.isCommentCreator = function(comment){
      return comment.user._id === $scope.$parent.currentUser._id;
    };

    $scope.isTaskCreator = function () {
      return $scope.task.creator._id === $scope.$parent.currentUser._id;
    };

    $scope.getTaskInfo = function () {
      taskRequestFactory.getTask({
        params: taskId,
        success: function (response) {
          $scope.task = response.data.task;
          $scope.boardStates = response.data.boardStates;
          projectRequestFactory.getFullCollaboratorsForProject({
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

    $scope.openUpdateTaskModal = function(size){
      var modalInstance = $modal.open({
        templateUrl: 'views/task/updatetask.html',
        controller: 'updateTaskCtrl',
        size: size,
        resolve:{
          task: function(){
            return $scope.task;
          },
          collaborators: function () {
            return $scope.collaborators;
          },
          boardStates:function(){
            return $scope.boardStates;
          }
        }
      });
      modalInstance.result.then(function (task) {
        $scope.task = task;

      }, function () {
      })
    };

    $scope.createStyle = function (sort, inputField) {
      editorFactory.createStyle(sort, inputField);
    };
    $scope.comment='';

    $scope.deleteComment = function (comment) {
      var commentInformation = {};
      commentInformation.commentId = comment._id;
      taskRequestFactory.deleteComment({
        params: commentInformation,
        success:function(response){

        },
        error:function(error){

        }
      })
    };

    $scope.editText = function (index) {
      $scope.comment = $scope.task.comments[index].comment;
      //$scope.comment = comment.comment;
      $location.hash('editor');
      $anchorScroll();


    }


  });
