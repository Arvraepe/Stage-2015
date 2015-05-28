'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectNewprojectCtrl
 * @description
 * # ProjectNewprojectCtrl
 * Controller of the cstageprojectApp
 */
angular.module('stageprojectApp')
  .controller('NewProjectCtrl', ['$scope', 'projectRequestFactory', '$modalInstance', 'notificationFactory', '$window', function ($scope, projectRequestFactory, $modalInstance, notificationFactory, $window) {

    $scope.project = {};
    $scope.project.collaborators = [];
    $scope.collaborators = {};
    $scope.project.standardStates = [
      'Not Started',
      'In Progress',
      'Finished'
    ];
    $scope.allUsernames = [];

    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.getUsers = function (username) {
      var usernameJson = {
        username: username
      };
      if (username.length > 2) {
        projectRequestFactory.getUsers({
          params: usernameJson,
          success: function (response) {
            $scope.allUsernames = [];
            angular.forEach(response.data.users, function (user) {
              $scope.allUsernames.push(user);
            });
          },
          error: function (error) {
            console.log(error);
          }
        });
      }

    };


    $scope.createProject = function (project) {
      if ($scope.newprojectForm.$valid) {
        angular.forEach($scope.collaborators.collabs, function (collab) {
          $scope.project.collaborators.push(collab.username);
        });
        projectRequestFactory.createProject({
          data: project,
          success: function (response) {
            notificationFactory.createNotification(response);
            $modalInstance.close(response.data.project);
          },
          error: function (error) {
            console.log(error);
          }
        });
      }
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.tagTransform = function (text) {
      var item = {
        username : text
      };
      return item;
    }

  }]);
