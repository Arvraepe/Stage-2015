'use strict';

/**
 * @ngdoc directive
 * @name stageprojectApp.directive:uniqueEmail
 * @description
 * # uniqueEmail
 */
angular.module('stageprojectApp')
  .directive('uniqueEmail', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {
        element.bind('blur', function () {
          var inputNgElement, inputValue;
          ngModel.$setValidity('unique', true);
          ngModel.$loading = true;
          inputNgElement = angular.element(element);
          inputValue = inputNgElement.val();
          angular.forEach(scope.allEmails, function (email) {
            if (email == inputValue) {
              ngModel.$setValidity('unique', false);
            }
          });
          ngModel.$loading = false;
        })
      }
    };
  });
