'use strict';

/**
 * @ngdoc directive
 * @name stageprojectApp.directive:loginDialog
 * @description
 * # loginDialog
 */
angular.module('stageprojectApp')
  .directive('loginDialog', ['AUTHEVENTS', function (AUTHEVENTS) {
    return {
      restrict: 'A',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl',
      link: function (scope) {
        var showDialog = function () {
          scope.visible = true;
        };

        scope.visible = false;
        scope.$on(AUTHEVENTS.notAuthenticated, showDialog);
        scope.$on(AUTHEVENTS.sessionTimeout, showDialog)
      }
    };
  }]);
