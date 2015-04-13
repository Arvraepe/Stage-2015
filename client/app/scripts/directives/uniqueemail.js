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
        element.bind('keyup blur', function () {
          var inputNgElement, inputValue;
          ngModel.$setValidity('unique', true);
          ngModel.$loading = true;
          inputNgElement = angular.element(element);
          inputValue = inputNgElement.val();
          if(inputValue.length>7){
            var emailJson = {
              email : inputValue
            };
            userFactory.userExists(emailJson, function(response){
              if(response.data.exists){
                if(scope.$parent.currentUser.email === inputValue){
                  ngModel.$setValidity('unique',true);
                }
                else{
                  ngModel.$setValidity('unique', false);
                }
              }
              else if(!response.data.exists){
                ngModel.$setValidity('unique',true);
              }
            });
          }
          ngModel.$loading = false;
        })
      }
    };
  }]);
