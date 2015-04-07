'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.userFactory
 * @description
 * # userFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('userFactory', ['requestFactory', function (requestFactory) {

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

      loginUser: function (credentials, createSession, callback, error) {
        requestFactory.sendRequest({
          path: 'login',
          method: 'POST',
          data: credentials,
          success: function (response) {
            if (response.success) {
              createSession(response, callback);
            }
            else {
              error(response);
            }
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
      },
      getUsernames: function (usernamesList) {
        requestFactory.sendRequest({
          path: 'user/getallusers',
          method: 'get',
          success: function (response) {
            console.log(response);
            usernamesList(response.data.users);
          },
          error: function (response) {
            console.log('Something went wrong while retrieving all usernames' + response);
          }
        })
      }

    };


  }]);
