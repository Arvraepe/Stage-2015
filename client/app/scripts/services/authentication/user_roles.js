'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.USERROLES
 * @description
 * # USERROLES
 * Constant in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .constant('USERROLES', {
    all: '*',
    user: 'user',
    guest: 'guest'
  });
