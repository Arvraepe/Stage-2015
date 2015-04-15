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
      },
      createProject: function(project,callback){
        requestFactory.sendRequest({
          path:'project/create',
          method:'POST',
          data:project,
          success:function(response){
            callback(response);
          },
          error:function(response){
            callback(response);
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
