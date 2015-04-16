'use strict';

/**
 * @ngdoc filter
 * @name stageprojectApp.filter:startFrom
 * @function
 * @description
 * # startFrom
 * Filter in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .filter('startFrom', function () {
    return function (input,start) {
      start = +start;//parse to int
      return input.slice(start);
    };
  });
