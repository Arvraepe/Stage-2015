'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UpdateTaskCtrl
 * @description
 * # UpdatetaskCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('updateTaskCtrl', function ($scope, $modalInstance, task, collaborators, boardStates,taskRequestFactory) {
    $scope.task = angular.copy(task);
    $scope.collaborators = angular.copy(collaborators);
    $scope.boardStates = angular.copy(boardStates);
    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    };


    $scope.updateTask = function (task) {
      var assigneeId = task.assignee._id;
      var creatorId = task.creator._id;
      task.assignee= assigneeId;
      task.creator = creatorId;
      var taskInfo = {task:$scope.task};
      taskRequestFactory.changeState({
        data: taskInfo,
        success:function(response){
          $modalInstance.close(response.data.task);
        },
        error:function(error){
          console.log(error);
        }
      })
    }


  });
