'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UpdateuserCtrl
 * @description
 * # UpdateuserCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UpdateuserCtrl', ['$scope', 'userFactory', 'Session', function ($scope, userFactory, Session) {
    $scope.userinfotochange = {
      firstname: '',
      lastname: ''
    };


    $scope.updateUser = function (userinfotochange) {
      userinfotochange.token = Session.getId();
      console.log('op update knop gedrukt');
      console.log(userinfotochange);
      userFactory.updateUser(userinfotochange, function (data) {
        $scope.setCurrentUser(data.user);
      }, function () {
        console.log('updating user failed');
      });
    }


  }]);
