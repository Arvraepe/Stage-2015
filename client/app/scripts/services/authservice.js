'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.AuthService
 * @description
 * # AuthService
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('AuthService', ['userFactory', 'Session', function (userFactory, Session) {
    var authService = {};
    authService.login = function (credentials, callback, onError) {
      userFactory.loginUser(credentials, createSession, callback, onError);
    };

    function createSession(response, callback) {
      if (response.data != undefined) {
        Session.create(response.data.token, response.data.user.role);
      } else {
        //todo afhandelen on success:false
      }
      callback(response);
    }

    /*function onError(response, onErrorCallback) {
     onErrorCallback(response);
     }*/

    authService.logout = function () {
      Session.destroy();
      //userFactory.logoutUser(getResult, callback);
    };


    authService.isAuthenticated = function () {
      return !!Session.id;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;


  }]);
