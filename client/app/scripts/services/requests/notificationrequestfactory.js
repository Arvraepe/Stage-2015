'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.notifcationRequestFactory
 * @description
 * # notifcationRequestFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('notificationRequestFactory', function (requestFactory) {
    return {
      getNotificationsForUser: function (config) {
        requestFactory.sendRequest({
          path: 'notifications/user',
          method: 'GET',
          params: config.params,
          success: config.success,
          error: config.error
        })
      }
    };
  });
