'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.AUTHEVENTS
 * @description
 * # AUTHEVENTS
 * Constant in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .constant('AUTHEVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  });
