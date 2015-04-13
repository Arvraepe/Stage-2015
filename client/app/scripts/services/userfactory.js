'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.userFactory
 * @description
 * # userFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('userFactory', ['requestFactory', 'notificationFactory', 'notificationService',function (requestFactory, notificationFactory, notificationService) {

    return {
      registerUser: function (user, callback) {
        requestFactory.sendRequest({
          path: 'register',
          method: 'POST',
          data: user,
          success: function (response) {
            var credentials = {
              username: user.username,
              password: user.password
            };
            callback(credentials);
            //userFactory.loginUser(credentials);
            notificationFactory.createNotification(response);
          },
          error: function (response) {
            notificationService.error('Something went wrong while trying to register. Server might be down.')
          }

        })
      },

      loginUser: function (credentials, createSession, callback, error) {
        requestFactory.sendRequest({
          path: 'login',
          method: 'POST',
          data: credentials,
          success: function (response) {
            if(!response.success){
              notificationFactory.createNotification(response);
            }
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
            notificationService.error('Something went wrong while trying to update your profile. Server might be down.')
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
            notificationService.error('Something went wrong while trying to retrieve users in order to validate your' +
            'registration. Server might be down.')
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
            notificationService.error('Something went wrong while trying to change your password. Server might be down.')
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
            notificationService.error('Something went wrong while trying to change your email. Server might be down.')
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
            notificationService.error('Something went wrong while trying to invite coworkers. Server might be down.')
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
            notificationService.error('Something went wrong while trying to reset your password. Server might be down.')
          }
        })
      },
      recoverPassword: function (recover, callback) {
        requestFactory.sendRequest({
          path: 'user/resetpassword/confirm',
          method: 'PUT',
          data: recover,
          success: function (response) {
            notificationFactory.createNotification(response);
            callback(response);
            console.log(response);
          },
          error: function (response) {
            notificationService.error('Something went wrong while making your new password. Server might be down.')
          }
        })
      },
      getImageForCurrentUser: function (username, callback) {
        requestFactory.sendRequest({
          path: 'user/uploads/' + username,
          method: 'get',
          success: function (response) {
            callback(response);
          },
          error: function (response) {
            callback(response);
          }
        })
      },
      userExists : function(usernameOrEmail, callback){
        requestFactory.sendRequest({
          path:'user/exists',
          method: 'get',
          params: usernameOrEmail,
          success: function(response){
            callback(response);
          },
          error: function(response){
            callback(response);
          }
        })
      }
    };


  }]);
