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
        $scope.collaborators.push(collab);
        $scope.project.collaborators.push(collab);
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
              $scope.collaborators.push(user);
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
        var collabs = angular.copy($scope.project.collaborators);
        $scope.project.collaborators = [];
        angular.forEach(collabs, function (collab) {
          if(collab.username){
            $scope.project.collaborators.push(collab.username);
          }
          else{
            $scope.project.collaborators.push(collab);
          }

        });
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


    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.fillCustomStates = function(){
      $scope.customStates = [
      {
        status:''
      }
        ];
    };

    $scope.tagTransform = function (text) {
      var item = {
        username : text
      };
      return item;
    }



  });
