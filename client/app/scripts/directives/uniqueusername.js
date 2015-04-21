'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:uniqueUsername
 * @description
 * # uniqueUsername
 */
angular.module('stageprojectApp')
  .directive('uniqueUsername', ['userRequestHandler', function (userRequestHandler) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {
        element.bind('keyup blur', function () {
          var inputNgElement, inputValue;
          ngModel.$setValidity('unique', true);
          ngModel.$loading = true;
          inputNgElement = angular.element(element);
          inputValue = inputNgElement.val();
          if (inputValue.length > 2) {
            var usernameJson = {
              username: inputValue
            };
            userRequestHandler.userExists({
              params: usernameJson,
              success: function (response) {
                if (response.data.exists) {
                  ngModel.$setValidity('unique', false);
                }
                else if (!response.data.exists) {
                  ngModel.$setValidity('unique', true);
                }
              },
              error: function (error) {

              }
            });
          }
          ngModel.$loading = false;




        });
      }
    };
  }]);


