'use strict';

/**
 * @ngdoc service
 * @name stageproject.taskRequestFactory
 * @description
 * # taskRequestFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('taskRequestFactory', function (requestFactory) {
    return {
      getTask: function(config){
        requestFactory.sendRequest({
          path:'task',
          method:'GET',
          params: config.params,
          success:config.success,
          error:config.error
        })
      },
      createTask: function(config) {
        requestFactory.sendRequest({
          path: 'task',
          method: 'POST',
          data :config.data,
          success: config.success,
          error: config.error
        })
      }



    };
  });
