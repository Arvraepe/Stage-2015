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
    ,'$routeParams', 'userRequestHandler'
    ,function ($scope,$rootScope ,userFactory, $window, notificationService, AuthService, AUTHEVENTS, $routeParams, userRequestHandler) {
      if($routeParams.email != undefined){
        $scope.user = {
          email : $routeParams.email
        };
        if($routeParams.pid != undefined){
          $scope.user.projectId = $routeParams.pid;
        }
      }
      else{
        $scope.user = {}
      }
    $scope.confirmpassword = "";
    $scope.allUsernames = [];
    $scope.allEmails = [];

    $scope.register = function () {
      $scope.$broadcast('show-errors-check-validity');

      if (angular.equals($scope.confirmpassword, $scope.user.password)) {

        userRequestHandler.registerUser({
          data: $scope.user,
          success: function(response){
            var credentials = {
              username: $scope.user.username,
              password: $scope.user.password
            };
            AuthService.login(credentials, function (user){
              $scope.setCurrentUser(user.data.user, user.data.token);
              $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
              $window.location.href = '#/dashboard';
            });
          },
          error: function(error){
            console.log(error);
          }
        });

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

  }]);
