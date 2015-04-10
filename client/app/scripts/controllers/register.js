'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('RegisterCtrl', ['$scope','$rootScope' ,'userFactory', '$window', 'notificationService', 'AuthService', 'AUTHEVENTS'
    ,function ($scope,$rootScope ,userFactory, $window, notificationService, AuthService, AUTHEVENTS) {
    $scope.user = {};
    $scope.confirmpassword = "";
    $scope.allUsernames = [];
    $scope.allEmails = [];




    function getAllUsernames() {
      userFactory.getUsernames(function (userList) {
        angular.forEach(userList, function (uname) {
          $scope.allUsernames.push(uname.username);
          $scope.allEmails.push(uname.email);
        });
      })
    }


    $scope.register = function () {
      $scope.$broadcast('show-errors-check-validity');

      if (angular.equals($scope.confirmpassword, $scope.user.password)) {
        userFactory.registerUser($scope.user, function(credentials){
          AuthService.login(credentials, function (user){
            $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
            $scope.setCurrentUser(user.data.user, user.data.token);
          })
        });
        $window.location.href = '#/';
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
    //getAllUsernames();

  }]);
