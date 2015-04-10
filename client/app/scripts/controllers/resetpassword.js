'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ResetpasswordCtrl
 * @description
 * # ResetpasswordCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ResetpasswordCtrl', ['$scope', 'userFactory', '$window', function ($scope, userFactory, $window) {
    $scope.user = {
      email: ''
    };

    $scope.resetPassword = function (user) {
      userFactory.resetPassword(user);
      $window.location.href = '#/';
    }

  }]);
