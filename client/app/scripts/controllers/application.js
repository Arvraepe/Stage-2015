'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ApplicationCtrl', ['$scope', 'USERROLES', 'AuthService', 'loginFactory', function ($scope, USERROLES, AuthService, loginFactory) {
    $scope.currentUser = null;
    console.log($scope.currentUser);
    $scope.userRoles = USERROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    //console.log($scope.isAuthorized);
    $scope.setCurrentUser = function (data) {
      //$scope.currentUser = data.data.user;
      loginFactory.setUser(data.data.user);
    };


  }]);
