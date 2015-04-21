'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:InvitecoworkersCtrl
 * @description
 * # InvitecoworkersCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('InvitecoworkersCtrl', ['$scope', 'userRequestHandler','notificationFactory', function ($scope, userRequestHandler, notificationFactory) {
    $scope.coworkersToInvite = [{
      email: ''
    }];

    $scope.invite = function (coworkersToInvite) {
      userRequestHandler.inviteCoworkers({
        data:coworkersToInvite,
        success:function(response){
          notificationFactory.createNotification(response);
        },
        error: function(error){
          console.log(error);
        }
      });
    };
    $scope.addCoworker = function () {
      $scope.coworkersToInvite.push({
        email: ''
      })
    };
  }]);
