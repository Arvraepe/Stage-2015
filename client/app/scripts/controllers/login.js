'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('LoginCtrl', ['$scope', 'loginFactory', '$rootScope', 'AUTHEVENTS', 'AuthService', function ($scope, loginFactory, $rootScope, AUTHEVENTS, AuthService) {
    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.login = function (credentials) {
      console.log('op login knop gedrukt');
      AuthService.login(credentials, function (user) {
        $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
        $scope.setCurrentUser(user.data.user);
        //loginFactory.setUser(user.data.user);
      }, function () {
        $rootScope.$broadcast(AUTHEVENTS.loginFailed);
      });


    }
  }]);
