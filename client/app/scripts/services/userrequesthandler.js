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
      registerUser: function (config, successTrueCallback, successFalseCallback) {
        requestFactory.sendRequest({
          path: config.path,
          method: config.method,
          data: config.data,
          success: function(response){
            if(response.success){
              successTrueCallback();
              notificationFactory.createNotification(response);
            }
            else{
              successFalseCallback(response)
            }
          },
          error:function(response){
            notificationFactory.createNotification(response);
          }
        })
      }
    };
  }]);
