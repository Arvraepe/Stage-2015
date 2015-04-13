'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UserRecoverCtrl
 * @description
 * # UserRecoverCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UserRecoverCtrl', ['$scope', 'userFactory', '$routeParams', '$window', 'AuthService', function ($scope, userFactory, $routeParams, $window, AuthService) {
    $scope.recover = {
      newPassword: '',
      uuid: $routeParams.uuid
    };
    $scope.confirmPassword = '';
    $scope.recoverPassword = function (recover) {
      $scope.$broadcast('show-errors-check-validity');
      userFactory.recoverPassword(recover, function(data){
        var credentials = {
          username : data.data.user.username,
          password : $scope.recover.newPassword
        };
        AuthService.login(credentials, function(user){
          $scope.setCurrentUser(user.data.user, user.data.token);
          $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
        });

      });
      $window.location.href = '#/';
    }
  }]);
