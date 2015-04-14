'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.projectFactory
 * @description
 * # project/projectFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('projectFactory', ['requestFactory', function (requestFactory) {
    return {
      getUsers: function (username, callback) {
        requestFactory.sendRequest({
          path: 'user/findlike',
          method: 'GET',
          params: username,
          success: function (response) {
            callback(response);
          },
          error: function (response) {
            callback(response);
          }

        })
      }
    }



    }]);
