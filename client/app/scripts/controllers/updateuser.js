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
    var sId = Session.getId();

    $scope.updateUser = function (userinfotochange) {
      userFactory.updateUser(userinfotochange, function (data) {
        $scope.setCurrentUser(data.user, sId);
      }, function () {
        console.log('updating user failed');
      });
    }


  }]);
