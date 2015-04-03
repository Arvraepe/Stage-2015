'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.userFactory
 * @description
 * # userFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('userFactory', ['requestFactory', 'Session', function (requestFactory, Session) {

    return {
      registerUser: function (user, success, error) {
        requestFactory.sendRequest({
          path: 'register',
          method: 'POST',
          data: user,
          success: function (response) {
            success(response);
          },
          error: function (response) {
            error(response);
          }

        })
      },

      loginUser: function (credentials, createSession, callback) {
        requestFactory.sendRequest({
          path: 'login',
          method: 'POST',
          data: credentials,
          success: function (response) {
            createSession(response, callback);
          },
          error: function (response) {
            error(response);
          }
        }, createSession)
      },

      updateUser: function (userinfotochange, newUserInfo) {
        requestFactory.sendRequest({
          path: 'user/updateuser',
          method: 'PUT',
          data: userinfotochange,
          success: function (response) {
            console.log(response);
            newUserInfo(response.data);
          },
          error: function (response) {
            console.error('Something went wrong while registering ' + response);
          }
        })
      }
    };


  }]);
