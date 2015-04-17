'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProjectUpdatedetailsCtrl
 * @description
 * # ProjectUpdatedetailsCtrl
 * Controller of the clientApp
 */
angular.module('stageprojectApp')
  .controller('UpdateDetailsCtrl', function ($scope, $modalInstance, project, projectRequestFactory, notificationFactory) {
    $scope.project = angular.copy(project);
    $scope.collaborators = [];

    function fillCollaborators() {
      $scope.project.collaborators = [];
      angular.forEach(project.collaborators, function (collab) {
        $scope.collaborators.push(collab.username);
        $scope.project.collaborators.push(collab.username);
      });

    }

    $scope.custom = true;
    $scope.customStates = [{
      status: ''
    }];
    $scope.addState = function () {
      $scope.customStates.push({
        status: ''
      });
    };
    $scope.standardStates = [
      {status: 'Not Started'},
      {status: 'In Progress'},
      {status: 'Finished'}
    ];

    fillCollaborators();

    $scope.getUsers = function (username) {
      var usernameJson = {
        username: username
      };
      if (username.length > 2) {
        projectRequestFactory.getUsers({
          params: usernameJson,
          success: function (response) {
            $scope.collaborators = [];
            angular.forEach(response.data.users, function (user) {
              $scope.collaborators.push(user.username);
            });
          },
          error: function (error) {
            console.log(error);
          }
        });
      }
    };

    $scope.updateProject = function (project) {

      if ($scope.custom) {
        project.standardStates = $scope.standardStates;
      }
      else {
        project.standardStates = $scope.customStates;
      }

      projectRequestFactory.updateProject({
        data: project,
        success: function (response) {
          notificationFactory.createNotification(response);
          console.log(response);
        }
      });
    };

    $scope.dateFormat = 'dd-MMMM-yyyy';
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.disabledTime = function (date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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
