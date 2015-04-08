'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ChangeemailCtrl
 * @description
 * # ChangeemailCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ChangeemailCtrl', ['$scope', 'userFactory', function ($scope, userFactory) {
    $scope.email = '';
    $scope.changeEmail = function (email) {
      userFactory.changeEmail(email, function (data) {
        console.log(data);
        //todo: afhandelen response
      });
    }
  }]);
