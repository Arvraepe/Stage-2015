'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:uniqueUsername
 * @description
 * # uniqueUsername
 */
angular.module('stageprojectApp')
  .directive('uniqueUsername', ['userFactory', function (userFactory) {
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
          if(inputValue.length>2){
            var usernameJson = {
              username : inputValue
            };
            userFactory.userExists(usernameJson, function(response){
              if(response.data.exists){
                ngModel.$setValidity('unique', false);
              }
              else if(!response.data.exists){
                ngModel.$setValidity('unique',true);
              }
            });
          }
          ngModel.$loading = false;


        });
      }
    };
  }]);


