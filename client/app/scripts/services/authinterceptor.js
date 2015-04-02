'use strict';

/**
 * @ngdoc service
 * @name clientApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the clientApp.
 */
angular.module('stageprojectApp')
  .factory('AuthInterceptor', ['$rootScope', '$q', 'AUTHEVENTS', function ($rootScope, $q, AUTHEVENTS) {

    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTHEVENTS.notAuthenticated,
          403: AUTHEVENTS.notAuthorized,
          419: AUTHEVENTS.sessionTimeout,
          440: AUTHEVENTS.sessionTimeout
        }[response.status], response);
        return $q.reject(response);
      }
    };


  }]);
