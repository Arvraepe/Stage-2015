'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ApplicationCtrl', ['$scope', 'USERROLES', 'AuthService', 'loginFactory', '$rootScope', 'AUTHEVENTS', 'Session',
    '$window', 'userFactory', 'localStorageService',function ($scope, USERROLES, AuthService, loginFactory, $rootScope,
                                                               AUTHEVENTS, Session, $window, userFactory, localStorageService) {

      $scope.userRoles = USERROLES;
      $scope.isAuthorized = AuthService.isAuthorized;
      $scope.isLoginPage = true;
      $scope.requestsBusy=0;

      $scope.setCurrentUser = function (user, token) {
        if(token ==undefined){
          token = Session.getId();
        }
        $scope.currentUser = user;
        localStorageService.set('userInfo', $scope.currentUser);
        localStorageService.set('tokenInfo', token);
        Session.setId(token);
      };


      $scope.logout = function () {
        AuthService.logout();
        localStorageService.remove('userInfo');
        localStorageService.remove('tokenInfo');
        $rootScope.$broadcast(AUTHEVENTS.logoutSuccess);
        $scope.currentUser = {};
        $window.location.href = "#/main";
      };

      $scope.currentUser = loginFactory.getUser();

      $scope.$on('requestEventStarted', function(){
        $scope.requestsBusy++;
      });
      $scope.$on('requestEventStopped', function(){
        $scope.requestsBusy--;
      })


    }]);
