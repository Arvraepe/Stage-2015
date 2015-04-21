'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.Session
 * @description
 * # Session
 * Service in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .service('Session', function () {
    this.getId = function () {
      return this.id;
    };
    this.create = function (sessionId, userRole) {
      this.id = sessionId;
      this.userRole = userRole;
    };
    this.destroy = function () {
      this.id = null;
      this.userRole = null;
    };
    this.setId = function (token) {
      this.id = token;
    }
  });
