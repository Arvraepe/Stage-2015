'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('DashboardCtrl', ['loginFactory','$scope', function ($scope, loginFactory) {
    $scope.user = loginFactory.getUser();
  }]);
