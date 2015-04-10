'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:InvitecoworkersCtrl
 * @description
 * # InvitecoworkersCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('InvitecoworkersCtrl', ['$scope', 'userFactory', function ($scope, userFactory) {
    $scope.coworkersToInvite = [{
      email: ''
    }];

    $scope.invite = function (coworkersToInvite) {
      userFactory.inviteCoworkers(coworkersToInvite)
    };

    $scope.addCoworker = function () {
      $scope.coworkersToInvite.push({
        email: ''
      })
    };
  }]);
