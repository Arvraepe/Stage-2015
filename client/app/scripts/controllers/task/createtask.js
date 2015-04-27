'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:CreatetaskCtrl
 * @description
 * # CreateTaskCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('CreateTaskCtrl', function ($scope, board, taskRequestFactory, $modalInstance) {
    $scope.board = board;
    $scope.task = {};
    $scope.task.important = false;

    $scope.createTask = function (task) {
      if ($scope.createTaskForm.$valid) {
        task.boardId = $scope.board._id;
        var taskInfo = {
          projectId: $scope.board.projectId,
          task: task
        };
        taskRequestFactory.createTask({
          data: taskInfo,
          success: function (response) {

          },
          error: function (error) {
            console.log(error);
          }
        })
      }

    };


    $scope.dateFormat = 'dd-MMMM-yyyy';
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


  });
