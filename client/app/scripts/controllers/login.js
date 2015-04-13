'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('LoginCtrl', ['$scope', 'loginFactory', '$rootScope', 'AUTHEVENTS', 'AuthService', 'notificationService',
    '$window', 'userFactory', function ($scope, loginFactory, $rootScope, AUTHEVENTS, AuthService, notificationService, $window, userFactory) {
      $scope.credentials = {
        username: '',
        password: ''
      };

      $scope.login = function (credentials) {
        AuthService.login(credentials, function (user) {
          $rootScope.$broadcast(AUTHEVENTS.loginSuccess);

          $scope.setCurrentUser(user.data.user, user.data.token);
          $window.location.href = '#/dashboard';


          //loginFactory.setUser(user.data.user);
        }, function (user) {
          $rootScope.$broadcast(AUTHEVENTS.loginFailed);

        });


      }
    }]);
