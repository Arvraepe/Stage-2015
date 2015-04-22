'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.AuthService
 * @description
 * # AuthService
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('AuthService', ['Session','userRequestHandler', function (Session, userRequestHandler) {
    var authService = {};
    authService.login = function (config) {
      userRequestHandler.loginUser({
        data:config.data,
        success:config.success,
        error: config.error
      });
    };

    authService.logout = function () {
      Session.destroy();
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
