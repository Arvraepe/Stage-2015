'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectNewprojectCtrl
 * @description
 * # ProjectNewprojectCtrl
 * Controller of the cstageprojectApp
 */
angular.module('stageprojectApp')
  .controller('NewProjectCtrl', [ '$scope','projectFactory' , function ($scope, projectFactory) {

    $scope.project = {};
    $scope.project.collaborators = [];
    $scope.allUsernames = [];


    $scope.getUsers = function(username){
      projectFactory.getUsers(username, function(response){
        angular.forEach(response.data.users, function(user){
          $scope.allUsernames.push(user.username);
        })
      })
    };




  }]);
