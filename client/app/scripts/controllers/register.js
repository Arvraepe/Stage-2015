'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('RegisterCtrl', ['$scope', 'userFactory', '$window', 'notificationService', function ($scope, userFactory, $window, notificationService, auth) {
    $scope.user = {};
    $scope.confirmpassword = "";
    $scope.allUsernames = [];

    $scope.gekregenVanApp = auth;

    function getAllUsernames() {
      userFactory.getUsernames(function (userList) {
        angular.forEach(userList, function (uname) {
          $scope.allUsernames.push(uname.username);
        });
        console.log($scope.allUsernames);
        //$scope.allUsernames = userList.username;
      })
    }


    $scope.register = function () {
      $scope.$broadcast('show-errors-check-validity');

      if (angular.equals($scope.confirmpassword, $scope.user.password)) {
        userFactory.registerUser($scope.user);
      }
      if ($scope.registerForm.$valid) {
        $scope.reset();
      }
    };

    $scope.reset = function () {
      $scope.$broadcast('show-errors-reset');
      $scope.user = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        username: ''
      }
    };
    getAllUsernames();

  }]);
