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
      registerUser: function (config) {
        requestFactory.sendRequest({
          path: 'register',
          method: 'POST',
          data: config.data,
          success: config.success,
          error: config.error
        });
      },
      getUserById: function(config){
        requestFactory.sendRequest({
          path:'user/getuser',
          method:'GET',
          params: config.params,
          success:config.success,
          error: config.error
        });
      },
      loginUser: function(config){
        requestFactory.sendRequest({
          path:'login',
          method:'POST',
          data:config.data,
          success:config.success,
          error:config.error
        });
      },
      inviteCoworkers : function(config){
        requestFactory.sendRequest({
          path:'user/invitecoworkers',
          method:'POST',
          data:config.data,
          success:config.success,
          error:config.error
        });
      },
      resetPassword: function(config){
        requestFactory.sendRequest({
          path: 'user/resetpassword',
          method: 'POST',
          data:config.data,
          success:config.success,
          error:config.error
        })
      },
      recoverPassword: function(config){
        requestFactory.sendRequest({
          path: 'user/resetpassword/confirm',
          method: 'PUT',
          data:config.data,
          success:config.success,
          error:config.error
        })
      },
      updateUser : function(config){
        requestFactory.sendRequest({
          path: 'user/updateuser',
          method: 'PUT',
          data:config.data,
          success:config.success,
          error:config.error
        })
      },
      userExists: function(config){
        requestFactory.sendRequest({
          path: 'user/exists',
          method: 'GET',
          params:config.params,
          success:config.success,
          error:config.error
        })
      }
    };
  }]);
