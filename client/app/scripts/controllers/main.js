'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
