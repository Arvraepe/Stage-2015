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
    '$window', 'userFactory', 'localStorageService', function ($scope, USERROLES, AuthService, loginFactory, $rootScope,
                                                               AUTHEVENTS, Session, $window, userFactory, localStorageService) {

      //console.log($scope.currentUser);
      $scope.userRoles = USERROLES;
      $scope.isAuthorized = AuthService.isAuthorized;
      $scope.isLoginPage = true;
      //$scope.visible = false;


      $scope.setCurrentUser = function (user, token) {
        if(token ==undefined){
          token = Session.getId();
        }
        //$scope.currentUser = user;
        $scope.currentUser = user;
        localStorageService.set('userInfo', $scope.currentUser);
        localStorageService.set('tokenInfo', token);
        //loginFactory.setUser(user, token, file);
        Session.setId(token);
      };

      $scope.setAvatarForCurrentUser = function (file) {
        $scope.currentUser.avatar = file;
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



    }]);
