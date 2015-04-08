'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('LoginCtrl', ['$scope', 'loginFactory', '$rootScope', 'AUTHEVENTS', 'AuthService', 'notificationService', '$window', function ($scope, loginFactory, $rootScope, AUTHEVENTS, AuthService, notificationService, $window) {
    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.login = function (credentials) {
      console.log('op login knop gedrukt');
      AuthService.login(credentials, function (user) {
        $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
        $scope.setCurrentUser(user.data.user, user.data.token);
        $window.location.href = '#/dashboard';


        //loginFactory.setUser(user.data.user);
      }, function (user) {
        $rootScope.$broadcast(AUTHEVENTS.loginFailed);
        notificationService.notify({
          title: 'Login failed.',
          title_escape: false,
          text: user.messages.message,
          text_escape: false,
          styling: "bootstrap3",
          type: "error",
          icon: true
        });
      });


    }
  }]);
