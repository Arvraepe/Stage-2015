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
      getProjectsForUser: function(config,successTrueCallback, successFalseCallback, errorCallback){
        requestFactory.sendRequest({
          path:'project/getprojects',
          method:'GET',
          params: {},
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
