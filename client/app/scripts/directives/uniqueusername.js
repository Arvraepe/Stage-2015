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
          for (var i = 0; i < scope.allUsernames.length; i++) {
            console.log(scope.allUsernames[i]);
            if (scope.allUsernames[i] == inputValue) {
              ngModel.$setValidity('unique', false);
            }
          }
          ngModel.$loading = false;


        });
      }
    };
  });

/*function cmparenique(arr, inputvalue, ngModel) {
 if(arr.length == 0) {
 return ;
 }
 var element = arr.splice(0,1);
 if (element == inputvalue) {
 ngModel.$setValidity('unique',false);
 }
 cmparenique(arr,inputvalue, ngModel);
 }*/
