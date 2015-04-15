'use strict';

/**
 * @ngdoc service
 * @name stageproject.userRequestHandler
 * @description
 * # userRequestHandler
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('userRequestHandler', ['requestFactory', 'notificationFactory', function (requestFactory, notificationFactory) {
    return {
      registerUser: function (config) {
        requestFactory.sendRequest({
          path: 'register',
          method: 'POST',
          data: config.data,
          success: config.success,
          error: config.error
        })
      }
    };
  }]);
