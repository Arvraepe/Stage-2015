'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.AuthService
 * @description
 * # AuthService
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('AuthService', ['userFactory', 'Session', '$rootScope', function (userFactory, Session, $rootScope) {
    var authService = {};
    authService.login = function (credentials, callback) {
      userFactory.loginUser(credentials, createSession, callback);
    };

    function createSession(response, callback) {
      //console.log(response);
      if (response.data != undefined) {
        Session.create(response.data.token, response.data.user.role);
        //Session.create(response.data.sessionid, response.data.user._id, response.data.user.role);
      } else {
        //todo afhandelen on success:false
      }
      callback(response);
    }

    authService.logout = function (callback) {
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
