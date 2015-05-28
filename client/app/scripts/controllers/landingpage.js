'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LandingpageCtrl
 * @description
 * # LandingpageCtrl
 * Controller of the clientApp
 */
angular.module('stageprojectApp')
  .controller('LandingpageCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
