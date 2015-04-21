'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectNewprojectCtrl
 * @description
 * # ProjectNewprojectCtrl
 * Controller of the cstageprojectApp
 */
angular.module('stageprojectApp')
  .controller('NewProjectCtrl', [ '$scope','projectRequestFactory' ,'$modalInstance','notificationFactory', '$window', function ($scope, projectRequestFactory, $modalInstance, notificationFactory, $window) {

    $scope.project = {};
    $scope.project.collaborators = [];
    $scope.allUsernames = [];
    $scope.custom=true;
    $scope.customStates = [{
      status:''
    }];
    $scope.addState = function(){
      $scope.customStates.push({
        status: ''
      });
    };
    $scope.standardStates = [
      {status: 'Not Started'},
      {status: 'In Progress'},
      {status: 'Finished'}
    ];

    $scope.dateFormat= 'dd-MMMM-yyyy';
    $scope.minDate = $scope.minDate? null: new Date();
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.disabledTime = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.getUsers = function(username){
      var usernameJson = {
        username: username
      };
      if(username.length>2){
        projectRequestFactory.getUsers({
          params:usernameJson,
          success: function(response){
            $scope.allUsernames = [];
            angular.forEach(response.data.users, function(user){
              $scope.allUsernames.push(user.username);
            });
          },
          error: function(error){
            console.log(error);
          }
        });
      }

    };


    $scope.createProject = function(project){
      if($scope.newprojectForm.$valid){
        if($scope.custom){
          project.standardStates = $scope.standardStates;
        }
        else{
          project.standardStates = $scope.customStates;
        }
        projectRequestFactory.createProject({
          data: project,
          success: function(response){
            notificationFactory.createNotification(response);
            $modalInstance.close(response.data.project);
          },
          error: function(error){
            console.log(error);
          }
        });
      }

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };



  }]);
