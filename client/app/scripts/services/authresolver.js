'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.AuthResolver
 * @description
 * # AuthResolver
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('AuthResolver', ['$q', '$rootScope', '$window', function ($q, $rootScope, $window) {


    // Public API here
    return {
      resolve: function () {
        var deferred = $q.defer();
        var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
          if (angular.isDefined(currentUser)) {
            if (currentUser) {
              deferred.resolve(currentUser);
            } else {
              deferred.reject();
              $window.location.href = "#/login";
              //$state.go('user-login');
            }
            unwatch();
          }
        });
        return deferred.promise;
      }
    };
  }]);
