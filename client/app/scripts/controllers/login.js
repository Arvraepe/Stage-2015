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
          userFactory.getImageForCurrentUser(user.data.user.username, function (file) {
            if (file.code === 'InternalError') {
              $scope.setCurrentUser(user.data.user, user.data.token);
            }
            else {
              $scope.setCurrentUser(user.data.user, user.data.token, file);
            }
          });
          $window.location.href = '#/dashboard';


          //loginFactory.setUser(user.data.user);
        }, function (user) {
          $rootScope.$broadcast(AUTHEVENTS.loginFailed);

        });


      }
    }]);
