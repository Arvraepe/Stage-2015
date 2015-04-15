'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.requestFactory
 * @description
 * # requestFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('requestFactory', ['$http', 'Session', function ($http, Session) {
    var baseUrl = 'http://localhost:6543';


    return {
      sendRequest: function (config, getResult) {
        if(Session.getId() !=undefined){
          if(config.data != undefined){
            config.data.token = Session.getId();
          }
          else if(config.params != undefined){
            config.params.token = Session.getId();
          }
        }

        $http({
          url: baseUrl + '/' + config.path,
          method: config.method,
          dataType: 'json',
          data: config.data,
          params: config.params
        }).success(config.success, getResult).error(config.error);
      }
    };


  }]);
