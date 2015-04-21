'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.loginFactory
 * @description
 * # loginFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('loginFactory', ['localStorageService', function (localStorageService) {
    var loggedInUser = {};

    return {
      getUser: function () {
        if (localStorageService.get('userInfo') != null) {
          return localStorageService.get('userInfo');
        }
        else {
          return loggedInUser;
        }
      },
      setUser: function (value) {
        loggedInUser = value;
      },
      clearUser: function () {
        loggedInUser = {};
        localStorageService.remove('userInfo');
        localStorageService.remove('tokenInfo');
      },
      setUserImage: function (file) {
        loggedInUser.avatar = file;
      }
    };
  }]);
