'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ChangepasswordCtrl
 * @description
 * # ChangepasswordCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ChangepasswordCtrl', ['$scope', 'userFactory', 'Session', '$window', function ($scope, userFactory, Session, $window) {
    $scope.password = {
      oldPassword: '',
      newPassword: ''
    };

    $scope.confirmpassword = '';

    $scope.changePassword = function (password) {
      if (angular.equals($scope.password.newPassword, $scope.confirmpassword)) {
        userFactory.changePassword(password, function (data) {
          console.log(data);
        });
        $window.location.href = '#/';
      }


    };


  }]);
