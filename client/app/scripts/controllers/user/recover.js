'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UserRecoverCtrl
 * @description
 * # UserRecoverCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UserRecoverCtrl', ['$scope', 'userFactory', '$routeParams', '$window', function ($scope, userFactory, $routeParams, $window) {
    $scope.recover = {
      newPassword: '',
      uuid: $routeParams.uuid
    };
    $scope.confirmPassword = '';
    $scope.recoverPassword = function (recover) {
      userFactory.recoverPassword(recover);
      $window.location.href = '#/';
    }
  }]);
