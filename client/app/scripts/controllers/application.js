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
    '$window', function ($scope, USERROLES, AuthService, loginFactory, $rootScope, AUTHEVENTS, Session, $window) {

      $scope.currentUser = loginFactory.getUser();
      console.log($scope.currentUser);
      $scope.userRoles = USERROLES;
      $scope.isAuthorized = AuthService.isAuthorized;
      $scope.isLoginPage = true;
      $scope.visible = false;


      $scope.setCurrentUser = function (user, token) {
        //$scope.currentUser = user;
        loginFactory.setUser(user, token);
        Session.setId(token);
      };

      $scope.logout = function () {
        AuthService.logout();
        $rootScope.$broadcast(AUTHEVENTS.logoutSuccess);
        loginFactory.clearUser();
        $window.location.href = "#/main";

      }


    }]);
