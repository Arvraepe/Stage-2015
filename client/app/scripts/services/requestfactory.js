'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.requestFactory
 * @description
 * # requestFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('requestFactory', ['$http', 'Session', 'notificationFactory', function ($http, Session, notificationFactory) {
    var baseUrl = 'http://localhost:6543';


    return {
      sendRequest: function (config, getResult) {
        if (Session.getId() != undefined) {
          if (config.data != undefined) {
            config.data.token = Session.getId();
          }
          else if (config.params != undefined) {
            config.params.token = Session.getId();
          }
        }
        if (Session.getId() != undefined && config.data != undefined) {
          config.data.token = Session.getId();
        }
        else if (Session.getId() != undefined && config.params != undefined) {
          config.params.token = Session.getId();
        }

        $http({
          url: baseUrl + '/' + config.path,
          method: config.method,
          dataType: 'json',
          data: config.data,
          params: config.params
        }).success(function (response) {
          if (response.success && config.success) config.success(response);
          else if (!response.success) {
            notificationFactory.createNotification(response);
            if (config.error) config.error(response);
          }
        }, getResult).error(function (error) {
          notificationService.error('NETWORK ERROR');
          if (config.error) config.error(error);
        });


        /*    .
         success(function (response) {
         if (response.success && config.success) {
         config.success(response);
         }
         }, getResult).error(function (error) {
         notificationService.error('Network error');
         })
         else
         if (!response.success) {
         notificationFactory.createNotification(response);
         if (config.error) config.error(response);
         }
         } config.success, getResult
         ).
         error(config.error);*/


        /*$http({
          url: baseUrl + '/' + config.path,
          method: config.method,
          dataType: 'json',
          data: config.data,
          params: config.params
        }).success(config.success, getResult).error(config.error);*/
      }
    };



  }]);
