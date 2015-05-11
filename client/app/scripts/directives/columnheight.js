'use strict';

/**
 * @ngdoc directive
 * @name stageprojectApp.directive:columnHeight
 * @description
 * # columnHeight
 */
angular.module('stageprojectApp')
  .directive('columnHeight', function ($interval, columnHeightFactory) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var angularElement = angular.element(element);
        //determine height of column -> apply same height to other columns using the columnHeightFactory
        $interval(function () {
          columnHeightFactory.setMaxHeight(angularElement.context.offsetHeight);
        },1000)
      }
    };
  });
