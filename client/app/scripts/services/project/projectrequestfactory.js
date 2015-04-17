'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.projectFactory
 * @description
 * # project/projectFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('projectRequestFactory', ['requestFactory', 'notificationFactory', function (requestFactory, notificationFactory) {
    return {
      getUsers: function (config, successTrueCallback, successFalseCallback, errorCallback) {
        requestFactory.sendRequest({
          path: 'user/findlike',
          method: 'GET',
          params: config.params,
          success: config.success,
          error: config.error
        })
      },
      createProject: function (config) {
        requestFactory.sendRequest({
          path: 'project/create',
          method: 'POST',
          data: config.data,
          success: config.success,
          error: config.error
        })
      },
      getProjectsForUser: function (config) {
        requestFactory.sendRequest({
          path: 'project/getprojects',
          method: 'GET',
          params: config.params,
          success: config.success,
          error: config.error
        })
      },
      getProjectById: function (config) {
        requestFactory.sendRequest({
          path: 'project/getproject',
          method: 'GET',
          params: config.params,
          success: config.success,
          error: config.error
        })
      },
      updateProject: function (config) {
        requestFactory.sendRequest({
          path: 'project/update',
          method: 'PUT',
          data: config.data,
          success: config.success,
          error: config.error
        })
      },
      deleteProject: function(config){
        requestFactory.sendRequest({
          path:'project/delete',
          method:'delete',
          params:config.params,
          success: config.success,
          error: config.error
        })
      }
    }


  }]);
