'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UserRecoverCtrl
 * @description
 * # UserRecoverCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UserRecoverCtrl', ['$scope','notificationFactory', 'userRequestHandler', '$routeParams', '$window', 'AuthService', 'Session',
    'AUTHEVENTS','$rootScope',function ($scope,notificationFactory, userRequestHandler, $routeParams, $window, AuthService,Session,AUTHEVENTS, $rootScope) {
    $scope.recover = {
      newPassword: '',
      uuid: $routeParams.uuid
    };
    $scope.confirmPassword = '';
    $scope.recoverPassword = function (recover) {
      $scope.$broadcast('show-errors-check-validity');
      userRequestHandler.recoverPassword({
        data: recover,
        success:function(response){
          var credentials = {
            username : response.data.user.username,
            password : $scope.recover.newPassword
          };
          AuthService.login({
            data: credentials,
            success:function(response){
              if (response.data != undefined) {
                Session.create(response.data.token, response.data.user.role);
              }
              $scope.setCurrentUser(response.data.user, response.data.token);
              $rootScope.$broadcast(AUTHEVENTS.loginSuccess);
              notificationFactory.createNotification(response);
              $window.location.href = '#/dashboard';
            },
            error: function(error){
              $rootScope.$broadcast(AUTHEVENTS.loginFailed);
            }
          });


        },
        error: function(error){

        }
      });

    }
  }]);
