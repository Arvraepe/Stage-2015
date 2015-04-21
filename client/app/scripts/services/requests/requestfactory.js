'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.requestFactory
 * @description
 * # requestFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('requestFactory', ['$http', 'Session', 'notificationFactory','notificationService','$rootScope', function ($http, Session, notificationFactory, notificationService, $rootScope) {
    var baseUrl = 'http://localhost:6543';


    return {
      sendRequest: function (config, getResult) {
        $rootScope.$broadcast('requestEventStarted');
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
          $rootScope.$broadcast('requestEventStopped');
          if (response.success && config.success) config.success(response);
          else if (!response.success) {
            notificationFactory.createNotification(response);
            if (config.error) config.error(response);
          }
        }, getResult).error(function (error) {
          $rootScope.$broadcast('requestEventStopped');
          notificationService.error('NETWORK ERROR');
          if (config.error) config.error(error);
        });

      }
    };



  }]);
