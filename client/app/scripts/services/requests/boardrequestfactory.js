'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.boardRequestFactory
 * @description
 * # boardRequestFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('boardRequestFactory', function (requestFactory) {
    return {
      createBoard: function (config) {
        requestFactory.sendRequest({
          params: config.data,
          path: 'board/create',
          method: 'POST',
          success: config.success,
          error: config.error
        })
      },

      getBoardInfo: function (config) {
        requestFactory.sendRequest({
          params: config.params,
          path: 'board',
          method: 'GET',
          success: config.success,
          error: config.error
        })
      },

      updateBoard: function (config) {
        requestFactory.sendRequest({
          data:config.data,
          path: 'board',
          method: 'PUT',
          success: config.success,
          error: config.error
        })
      },
      deleteBoard: function(config) {
        requestFactory.sendRequest({
          path: 'board',
          method: 'delete',
          params: config.params,
          success: config.success,
          error: config.error
        })
      }
    }
  });
