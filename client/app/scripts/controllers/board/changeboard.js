'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ChangeboardCtrl
 * @description
 * # ChangeboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ChangeBoardCtrl', function ($scope, $modalInstance) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
