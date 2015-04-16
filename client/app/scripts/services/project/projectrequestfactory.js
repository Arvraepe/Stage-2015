'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.projectFactory
 * @description
 * # project/projectFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('projectRequestFactory', ['requestFactory','notificationFactory', function (requestFactory, notificationFactory) {
    return {
      getUsers: function (config, successTrueCallback, successFalseCallback, errorCallback) {
        requestFactory.sendRequest({
          path:'user/findlike',
          method:'GET',
          params: config.params,
          success: config.success,
          error: config.error
        })
      },
      createProject: function(config){
        requestFactory.sendRequest({
          path:'project/create',
          method:'POST',
          data:config.data,
          success: config.success,
          error: config.error
        })
      },
      getProjectsForUser: function(config,successTrueCallback, successFalseCallback, errorCallback){
        requestFactory.sendRequest({
          path:'project/getprojects',
          method:'GET',
          params: config.params,
          success:function(response){
            if(response.success){
              successTrueCallback(response);
            }
            else{
              notificationFactory.createNotification(response);
              successFalseCallback(response);
            }
          },
          error:function(response){
            errorCallback(response);
          }
        })
      }
    }



    }]);
