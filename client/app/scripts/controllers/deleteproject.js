'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:DeleteprojectCtrl
 * @description
 * # DeleteprojectCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('DeleteProjectCtrl', function ($scope, $modalInstance, project,  notificationFactory, projectRequestFactory) {
    $scope.project = project;

    $scope.deleteProject = function () {
      var projectId = {
        projectId: $scope.project._id
      };
      projectRequestFactory.deleteProject({
        params: projectId,
        success: function (response) {
          notificationFactory.createNotification(response);
          $modalInstance.close();
        },
        error: function (error) {
          console.log(error);
        }
      });
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


  });
