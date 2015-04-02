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
      template: '<div ng-if="visible" ng-include = "\'login.html\'" > ',
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
