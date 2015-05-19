'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('TaskCtrl', function ($scope, $routeParams, taskRequestFactory, projectRequestFactory, $modal, $location, $anchorScroll, notificationFactory) {
    $scope.task = {};
    $scope.assigneeVisible = true;
    $scope.isCollapsed = false;
    $scope.editable=false;
    $scope.booleanArray = [];
    $scope.titleVisible = true;
    $scope.stateVisible = true;
    $scope.newCommentVisibile = false;
    $scope.projectId = {
      projectId:$routeParams.pid
    };

    $scope.isCollapsed = true;
    var taskId = {
      _id : $routeParams.taskId
    };

    function calculateTimeDifference() {
      var now = moment();
      var deadline = moment($scope.task.deadline);
      var duration = moment.duration(deadline.diff(now));
      var days = duration.asDays();
      $scope.lazyDate = days;
    }

    $scope.changeTitle = function ( title) {
      $scope.task.title = title;
      var taskInformation = {
        task: {
          _id : $scope.task._id,
          title : $scope.task.title
        }
      };
      taskRequestFactory.updateTask({
        data: taskInformation,
        success: function (response) {
          console.log(response);
          $scope.titleVisible = !$scope.titleVisible;
        },
        error: function (err) {
          console.log(err);
          $scope.titleVisible = !$scope.titleVisible;

        }
      })
    };


    $scope.getTaskInfo = function () {
      taskRequestFactory.getTask({
        params: taskId,
        success: function (response) {
          $scope.task = response.data.task;
          $scope.boardStates = response.data.boardStates;
          angular.forEach($scope.task.comments, function (comment) {
            $scope.booleanArray.push(false);
          });
          $scope.isCommentCreator = function(comment){
            return comment.user._id === $scope.$parent.currentUser._id;
          };
          $scope.isCreator = function(){
            return $scope.task.creator._id ===$scope.$parent.currentUser._id;
          };
          $scope.isAssignee = function () {
            return $scope.task.assignee._id === $scope.$parent.currentUser._id;
          };
          calculateTimeDifference();

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
         $scope.newCommentVisible = !$scope.newCommentVisible;
         $scope.comment='';
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

    $scope.comment='';

    $scope.deleteComment = function (comment) {
      var commentInformation = {};
      commentInformation.commentId = comment._id;
      taskRequestFactory.deleteComment({
        params: commentInformation,
        success:function(response){
          angular.forEach($scope.task.comments, function (comm, index,array) {
            if(comm._id == comment._id){
              array.splice(index,1);
            }
          });
          notificationFactory.createNotification(response);
        },
        error:function(error){
          notificationFactory.createNotification(response);
        }
      })
    };

    $scope.editText = function (index) {
      $scope.booleanArray[index] = true;
      $scope.commentEdit = $scope.task.comments[index].comment;


    };

    $scope.editComment = function (commentObj, commentHtml, index) {
      commentObj.comment = commentHtml;
      var commentInfo = {
        comment : commentObj
      };
      taskRequestFactory.updateComment({
        data:commentInfo,
        success:function(response){
          $scope.booleanArray[index] = false;
          commentObj=response.data.comment;
        },
        error: function (error) {
          $scope.booleanArray[index] = false;
          notificationFactory.createNotification(error);
          console.log(error);
        }
      })
    };

    $scope.changeAssignee=function(assignee){
      console.log(assignee);
      $scope.task.assignee =assignee;
      $scope.updateTask();
      $scope.assigneeVisible = true;
    };

    $scope.saveTitle = function ($event) {
      if($event.keyCode==9 || $event.keyCode==13){
        $scope.updateTask();
      }
    };

    $scope.setAssigneeVisibility = function () {
      $scope.assigneeVisible = true;
    };

    $scope.setStateVisiblity = function () {
      $scope.stateVisible = true;
    };

    $scope.changeState = function () {
      $scope.updateTask();
      $scope.stateVisible=true;
    };

    $scope.updateTask = function(){
      var taskInfo = angular.copy($scope.task);
      angular.forEach(taskInfo.comments, function (comment) {
        delete comment.user;
      });

      taskInfo.assignee = $scope.task.assignee._id;
      taskInfo.creator = $scope.task.creator._id;
      var task = {
        task: taskInfo
      };
      taskRequestFactory.updateTask({
        data: task,
        success: function (response) {
          $scope.task = response.data.task;
          $scope.titleVisible = true;
          $scope.stateVisible = true;
        },
        error: function (error) {
          notificationFactory.createNotification(response);
          console.log(error);
        }
      });

    };

    $scope.showCommentField = function () {
      $scope.newCommentVisibile = true;
    }


  });
