'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('DashboardCtrl', ['$scope', 'loginFactory', function ($scope, loginFactory) {
    //$scope.user = $scope.$parent.currentUser;
    $scope.user = loginFactory.getUser();
  }]);
