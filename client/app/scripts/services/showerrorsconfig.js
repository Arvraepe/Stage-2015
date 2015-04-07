'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.showErrorsConfig
 * @description
 * # showErrorsConfig
 * Provider in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .provider('showErrorsConfig', function () {
    // Private variables
    var _showSuccess;
    _showSuccess = false;

    // Private constructor


    // Public API for configuration
    this.showSuccess = function (showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.$get = function () {
      return {showSuccess: _showSuccess};
    };


  });
