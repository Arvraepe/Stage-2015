'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ChangepasswordCtrl
 * @description
 * # ChangepasswordCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ChangepasswordCtrl', ['$scope', 'userFactory', 'Session', function ($scope, userFactory, Session) {
    $scope.password = {
      oldPassword: '',
      newPassword: ''
    };

    $scope.confirmpassword = '';

    $scope.changePassword = function (password) {
      $scope.$broadcast('show-errors-check-validity');
      if (angular.equals($scope.password.newPassword, $scope.confirmpassword)) {
        userFactory.changePassword(password, function (data) {
          console.log(data);
        });
      }
      if ($scope.changePasswordForm.$valid) {
        $scope.reset();
      }

    };

    $scope.reset = function () {
      $scope.$broadcast('show-errors-reset');
      $scope.password = {
        oldpassword: '',
        newpassword: ''
      };
      $scope.confirmpassword = '';
    }

  }]);
