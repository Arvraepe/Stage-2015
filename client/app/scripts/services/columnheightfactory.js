'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.columnHeightFactory
 * @description
 * # columnHeightFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .service('columnHeightFactory', function ($timeout) {
    // Service logic
    // ...

    this.maxHeight = 70;
    this.setMaxHeight = function (height) {
      if (height > this.maxHeight) {
        this.maxHeight = height
      }
    };
    this.resetHeight = function () {
      this.maxHeight=70;
    };
    this.getMaxHeight = function () {
      return this.maxHeight;
    };

    // Public API here
    /*return {
      setMaxHeight: function (height) {
        if (height > maxHeight) {
          maxHeight = height;
        }
      },
      resetHeight: function () {
        maxHeight = 70;
      },
      getMaxHeight: function () {
        return maxHeight;
      }
    };*/
  });
