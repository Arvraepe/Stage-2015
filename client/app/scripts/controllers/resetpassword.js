'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ResetpasswordCtrl
 * @description
 * # ResetpasswordCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ResetpasswordCtrl', ['$scope', 'userFactory', function ($scope, userFactory) {
    $scope.email = '';

    $scope.resetPassword = function (email) {
      userFactory.resetPassword(email);
    }

  }]);
