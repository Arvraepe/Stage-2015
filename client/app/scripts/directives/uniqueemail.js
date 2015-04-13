'use strict';

/**
 * @ngdoc directive
 * @name stageprojectApp.directive:uniqueEmail
 * @description
 * # uniqueEmail
 */
angular.module('stageprojectApp')
  .directive('uniqueEmail', ['userFactory', function (userFactory) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {
        element.bind('keydown keypress', function () {
          var inputNgElement, inputValue;
          ngModel.$setValidity('unique', true);
          ngModel.$loading = true;
          inputNgElement = angular.element(element);
          inputValue = inputNgElement.val();
          if(inputNgElement.length>5){
            userFactory.userExists(inputValue)
          }
          angular.forEach(scope.allEmails, function (email) {
            if (email == inputValue) {
              ngModel.$setValidity('unique', false);
            }
          });
          ngModel.$loading = false;
        })
      }
    };
  }]);
