'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('RegisterCtrl', ['$scope', 'httpFactory','$window', function ($scope, httpFactory, $window) {
    $scope.user = {};
    $scope.register = function () {
      httpFactory.httpPost("/register", $scope.user).success(function (data) {
        //notificationService.success('Successing text')  ;
        $window.location.href="";

      }).error(function (err) {
        //notificationService.error('Something went wrong while registering, please try again.');
        console.log('Something went wrong while registering ' + err);
      });

    }

  }]);
