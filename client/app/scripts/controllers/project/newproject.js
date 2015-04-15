'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectNewprojectCtrl
 * @description
 * # ProjectNewprojectCtrl
 * Controller of the cstageprojectApp
 */
angular.module('stageprojectApp')
  .controller('NewProjectCtrl', [ '$scope','projectRequestFactory' ,'$modalInstance', function ($scope, projectRequestFactory, $modalInstance) {

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
          path:'user/findlike',
          method:'GET',
          params:usernameJson
        },getUsersSuccessTrue, getUsersSuccessFalse, getUsersError);
      }

    };

    function getUsersSuccessTrue(response){
      $scope.allUsernames = [];
      angular.forEach(response.data.users, function(user){
        $scope.allUsernames.push(user.username);
      });
      //console.log(response);
    }
    function getUsersSuccessFalse(response){
      console.log(response);
    }
    function getUsersError(response){
      console.log(response);
    }

    $scope.createProject = function(project){
      if($scope.custom){
        project.standardStates = $scope.standardStates;
      }
      else{
        project.standardStates = $scope.customStates;
      }
      projectRequestFactory.createProject({
        path:'project/create',
        method:'POST',
        data: project,
        success: createProjectSuccess(response),
        error: createProjectError(response)
      }, createProjectSuccessTrue, createProjectSuccessFalse, createProjectError);
      $modalInstance.dismiss('Cancel');
    };

    function createProjectSuccess(response){
      console.log(response);
    }
    function createProjectError(response){
      console.log(response);
    }




  }]);
