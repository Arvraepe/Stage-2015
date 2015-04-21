'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProjectUpdatedetailsCtrl
 * @description
 * # ProjectUpdatedetailsCtrl
 * Controller of the clientApp
 */
angular.module('stageprojectApp')
  .controller('UpdateDetailsCtrl', function ($scope, $modalInstance, project, projectRequestFactory, notificationFactory, loginFactory) {
    $scope.project = angular.copy(project);
    $scope.collaborators = [];

    function fillCollaborators() {
      $scope.project.collaborators = [];
      angular.forEach(project.collaborators, function (collab) {
        $scope.collaborators.push(collab.username);
        $scope.project.collaborators.push(collab.username);
      });

    }



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
      if ($scope.updateProjectForm.$valid) {

        project.leader = loginFactory.getUser()._id;

        projectRequestFactory.updateProject({
          data: project,
          success: function (response) {
            var responseProject = response.data.project;
            $modalInstance.close(responseProject);
            notificationFactory.createNotification(response);
            console.log(response);
          },
          error: function (error) {
            console.log(error)
          }
        });
      }
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
      console.log("cancel pressed");
    };

    $scope.fillCustomStates = function(){
      $scope.customStates = [
      {
        status:''
      }
        ];
    }


  });
