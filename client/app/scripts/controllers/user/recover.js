'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UserRecoverCtrl
 * @description
 * # UserRecoverCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UserRecoverCtrl', ['$scope', 'userFactory', '$routeParams', function ($scope, userFactory, $routeParams) {
    $scope.recover = {
      newPassword: '',
      uuid: $routeParams.uuid
    };
    $scope.confirmPassword = '';
    $scope.recoverPassword = function (recover) {
      userFactory.recoverPassword(recover);
    }
  }]);
