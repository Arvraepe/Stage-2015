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

      loginUser: function (credentials, getResult, callback) {
        requestFactory.sendRequest({
          path: 'login',
          method: 'POST',
          data: credentials,
          success: function (response) {
            Session.create(response.data.sessionid, response.data.user._id, response.data.user.role);
            getResult(response, callback);
          },
          error: function (response) {
            error(response);
          }
        }, getResult)
      }
    };


  }]);
