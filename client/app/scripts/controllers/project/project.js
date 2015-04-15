'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ProjectCtrl' ,['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
