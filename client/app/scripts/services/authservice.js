'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.AuthService
 * @description
 * # AuthService
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('AuthService', ['userFactory', 'Session', '$rootScope', function (userFactory, httpFactory, Session, $rootScope) {
    var authService = {};
    var antwoord;
    authService.login = function (credentials, callback) {
      userFactory.loginUser(credentials, getResult, callback);
    };

    function getResult(response, callback) {
      //console.log(response);
      callback(response);
    }


    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      /*var bool1 = authService.isAuthenticated();
       var bool2 = authorizedRoles.indexOf(Session.userRole) !== -1;*/
      return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;


  }]);
