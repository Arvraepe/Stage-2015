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
    '$window', 'userFactory','Session', function ($scope, loginFactory, $rootScope, AUTHEVENTS, AuthService, notificationService, $window, userFactory, Session) {
      $scope.credentials = {
        username: '',
        password: ''
      };

      $scope.login = function(credentials){
        AuthService.login({
          data: credentials,
          success: function(response){
            if (response.data != undefined) {
              Session.create(response.data.token, response.data.user.role);
            }
            $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
            $scope.setCurrentUser(response.data.user, response.data.token);
            $window.location.href = '#/dashboard';

          },
          error: function(error){
            $rootScope.$broadcast(AUTHEVENTS.loginFailed);
          }
        })
      };



    }]);
