'use strict';

/**
 * @ngdoc filter
 * @name stageprojectApp.filter:capitalize
 * @function
 * @description
 * # capitalize
 * Filter in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .filter('capitalize', function () {
    return function(input, scope) {
      if (input!=null && input!=undefined){
        input = input.toLowerCase();
        return input.substring(0,1).toUpperCase()+input.substring(1);

      }
      else return input;
    }
  });
