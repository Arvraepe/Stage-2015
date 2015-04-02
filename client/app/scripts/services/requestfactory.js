'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.requestFactory
 * @description
 * # requestFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('requestFactory', ['$http', function ($http) {
    var baseUrl = 'http://localhost:6543';


    // Public API here
    return {
      sendRequest: function (config, getResult) {
        $http({
          url: baseUrl + '/' + config.path,
          method: config.method,
          dataType: 'json',
          data: config.data
        }).success(config.success, getResult).error(config.error);
      }
    };


  }]);
