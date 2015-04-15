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
      if($routeParams.email==undefined){
        $scope.user = {};
      }
      else{
        $scope.user = {
          email : $routeParams.email
        }
      }
    $scope.confirmpassword = "";
    $scope.allUsernames = [];
    $scope.allEmails = [];



    $scope.register = function () {
      $scope.$broadcast('show-errors-check-validity');

      if (angular.equals($scope.confirmpassword, $scope.user.password)) {
        userRequestHandler.registerUser({
          path:'register',
          method: 'POST',
          data: $scope.user
        },successTrueCallback,successFalseCallback);

      }

    };

      function successTrueCallback(){
        var credentials = {
          username: $scope.user.username,
          password: $scope.user.password
        };
        AuthService.login(credentials, function (user){
          $scope.setCurrentUser(user.data.user, user.data.token);
          $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
          $window.location.href = '#/dashboard';
        });

      }
      function successFalseCallback(response){
        console.log(response);
      }
      function errorCallback(response){
        console.log(response);
      }


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
      /*userFactory.registerUser($scope.user, function(credentials){
       AuthService.login(credentials, function (user){
       $scope.setCurrentUser(user.data.user, user.data.token);
       $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
       })
       });*/

  }]);
