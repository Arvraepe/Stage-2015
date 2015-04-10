'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:uniqueUsername
 * @description
 * # uniqueUsername
 */
angular.module('stageprojectApp')
  .directive('uniqueUsername', function () {
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
          angular.forEach(scope.allUsernames, function (username) {
            if (username == inputValue) {
              ngModel.$setValidity('unique', false);

            }
          });
          ngModel.$loading = false;


        });
      }
    };
  });


