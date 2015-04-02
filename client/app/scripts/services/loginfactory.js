'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.loginFactory
 * @description
 * # loginFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('loginFactory', function () {
    var loggedInUser = {};

    return {
      getUser: function () {
        return loggedInUser;
      },
      setUser: function (value) {
        loggedInUser = value;
      },
      clearUser: function () {
        loggedInUser = {};
      }
    };
  });
