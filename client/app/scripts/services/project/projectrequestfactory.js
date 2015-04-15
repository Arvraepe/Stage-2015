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
          path: config.path,
          method: config.method,
          params: config.params,
          success: function (response) {
            if(response.success){
              successTrueCallback(response);
            }
            else{
              successFalseCallback(response);
            }
          },
          error: function (response) {
            errorCallback(response);
          }

        })
      },
      createProject: function(config,successTrueCallback, successFalseCallback, errorCallback){
        requestFactory.sendRequest({
          path:config.path,
          method:config.method,
          data:config.data,
          success:function(response){
            if(response.success){
              successTrueCallback(response);
            }
            else{
              successFalseCallback(response);
            }
            notificationFactory.createNotification(response);
          },
          error:function(response){
            errorCallback(response);
          }
        })
      },
      getProjectsForUser: function(callback){
        requestFactory.sendRequest({
          path:'project',
          method:'GET',
          success:function(response){
            callback(response);
          },
          error:function(response){
            callback(response);
          }
        })
      }
    }



    }]);
