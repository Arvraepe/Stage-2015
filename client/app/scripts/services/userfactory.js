'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.userFactory
 * @description
 * # userFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('userFactory', ['requestFactory', 'notificationFactory', function (requestFactory, notificationFactory) {

    return {
      registerUser: function (user, success, error) {
        requestFactory.sendRequest({
          path: 'register',
          method: 'POST',
          data: user,
          success: function (response) {
            notificationFactory.createNotification(response);
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
            notificationFactory.createNotification(response);
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
            notificationFactory.createNotification(response);
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
            usernamesList(response.data.users);
          },
          error: function (response) {
            console.log('Something went wrong while retrieving all usernames' + response);
          }
        })
      },
      changePassword: function (password, callback) {
        requestFactory.sendRequest({
          path: 'user/changepassword',
          method: 'PUT',
          data: password,
          success: function (response) {
            notificationFactory.createNotification(response);
            console.log(response);
            //callback(response);
          },
          error: function (response) {
            console.log('Something went wrong while resetting password');
          }
        })
      },
      changeEmail: function (email, callback) {
        requestFactory.sendRequest({
          path: 'user/changeemail',
          method: 'PUT',
          data: email,
          success: function (response) {
            notificationFactory.createNotification(response);
            console.log(response);
            //callback(response)
          },
          error: function (response) {
            console.log('Something went wrong while changing email');
          }
        })
      },
      inviteCoworkers: function (coworkersToInvite, callback) {
        requestFactory.sendRequest({
          path: 'user/invitecoworkers',
          method: 'POST',
          data: coworkersToInvite,
          success: function (response) {
            notificationFactory.createNotification(response);
            console.log(response);
          },
          error: function (response) {
            console.log('Something went wrong while inviting coworkers');
          }
        })
      },

      resetPassword: function (email, callback) {
        requestFactory.sendRequest({
          path: 'user/resetpassword',
          method: 'POST',
          data: email,
          success: function (response) {
            notificationFactory.createNotification(response);
            console.log(response);
          },
          error: function (response) {
            console.log('Something went wrong while resetting password');
          }
        })
      },
      recoverPassword: function (recover) {
        requestFactory.sendRequest({
          path: 'user/resetpassword/confirm',
          method: 'PUT',
          data: recover,
          success: function (response) {
            notificationFactory.createNotification(response);
            console.log(response);
          },
          error: function (response) {
            console.log('Something went wrong while recovering password');
          }
        })
      }
    };


  }]);
