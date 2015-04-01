'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('LoginCtrl', ['httpFactory','loginFactory', '$scope', function (loginFactory, httpFactory, $scope) {
    $scope.user = {};
    $scope.login = function () {
      alert('op login knop gedrukt');
      httpFactory.httpPost('/login', $scope.user).success(function (data) {
        alert('we zijn binneuuu ' + data);
        loginFactory.setUser(data);
      }).error(function () {
        alert('fout bij aanmelden');
        $scope.user.password = '';
      })
    }
  }]);
