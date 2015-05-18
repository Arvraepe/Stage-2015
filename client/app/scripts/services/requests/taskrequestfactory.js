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
          path: 'task/create',
          method: 'POST',
          data :config.data,
          success: config.success,
          error: config.error
        })
      },
      createComment: function(config){
        requestFactory.sendRequest({
          path:'task/comment',
          method:'POST',
          data:config.data,
          success:config.success,
          error:config.error
        })
      },
      changeState: function(config){
        requestFactory.sendRequest({
          path:'task/changestate',
          method:'PUT',
          data:config.data,
          success: config.success,
          error:config.error
        })
      },
      updateTask: function (config) {
        requestFactory.sendRequest({
          path:'task',
          method:'PUT',
          data:config.data,
          success:config.success,
          error:config.error
        })
      },
      deleteComment: function (config) {
        requestFactory.sendRequest({
          path:'task/comment',
          method:'DELETE',
          params:config.params,
          success: config.success,
          error:config.error
        })
      },
      updateComment: function (config) {
        requestFactory.sendRequest({
          path:'task/comment',
          method:'PUT',
          data:config.data,
          success: config.success,
          error:config.error
        })
      },
      switchBoard: function (config) {
        requestFactory.sendRequest({
          path:'task/switchboard',
          method:'PUT',
          data:config.data,
          success: config.success,
          error:config.error
        })
      }




    };
  });
